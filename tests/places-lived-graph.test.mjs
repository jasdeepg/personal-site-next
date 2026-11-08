import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import * as d3 from 'd3'
import ts from 'typescript'

const require = createRequire(import.meta.url)

function renderGraph() {
  const records = []
  const timeScales = []
  function selection(tag, data = []) {
    const record = { tag, data, attrs: {} }
    records.push(record)
    const api = {
      selectAll: () => selection('selection'),
      remove: () => api,
      data: (value) => { record.data = value; return api },
      enter: () => api,
      append: (value) => selection(value, record.data),
      attr: (key, value) => { record.attrs[key] = value; return api },
      filter: () => api,
      text: () => api,
      call: () => api,
    }
    return api
  }
  const context = {
    exports: {},
    require(name) {
      if (name === 'react') return { useRef: () => ({ current: {} }), useEffect: (fn) => fn() }
      if (name === 'd3') return {
        ...d3,
        select: () => selection('svg'),
        scaleTime: () => { const scale = d3.scaleTime(); timeScales.push(scale); return scale },
      }
      return require(name)
    },
  }
  const source = readFileSync(new URL('../components/places-lived-graph.tsx', import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  })
  vm.runInNewContext(outputText, context)
  context.exports.PlacesLivedGraph()
  return { records, timeScale: timeScales[0] }
}

test('only arrivals get dots, including return visits but not repeated observations', () => {
  const { records } = renderGraph()
  const circles = records.filter((record) => record.tag === 'circle')
  assert.equal(circles.length, 1, 'No extra standalone endpoint dot')
  const arrivals = circles[0].data
  for (const city of ['Boulder, CO', 'Denver, CO', 'San Francisco, CA']) {
    assert.equal(arrivals.filter((place) => place.city === city).length, 1, city)
  }
  assert.equal(arrivals.filter((place) => place.city === 'Raleigh, NC').length, 3)
  assert.equal(arrivals.filter((place) => place.city === 'Durham, NC').length, 4)
  assert.equal(arrivals[0].city, 'Raleigh, NC')
})

test('the final stay still extends through today without an endpoint dot', () => {
  const before = Date.now()
  const { records, timeScale } = renderGraph()
  const end = +timeScale.domain()[1]
  assert.ok(end >= before && end <= Date.now())
  const vertical = records.find((record) => record.attrs.class === 'vertical')
  const lastIndex = vertical.data.length - 1
  assert.equal(vertical.data[lastIndex].city, 'Boulder, CO')
  assert.equal(vertical.attrs.y2(vertical.data[lastIndex], lastIndex), 670)
})

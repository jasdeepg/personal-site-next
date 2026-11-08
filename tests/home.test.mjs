import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const require = createRequire(import.meta.url)

async function renderHome() {
  const source = readFileSync(new URL('../app/(app)/page.tsx', import.meta.url), 'utf8')
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText
  const context = {
    exports: {},
    require(name) {
      if (name === '@/flags') return {
        showPlacesGraph: async () => true,
        showContactSection: async () => true,
        companyFlag: async () => { throw new Error('The demo flag must not be evaluated') },
      }
      if (name === '@/components/places-lived-graph') return { PlacesLivedGraph: () => null }
      if (name === 'next/link') return (props) => React.createElement('a', props)
      return require(name)
    },
  }
  vm.runInNewContext(code, context)
  return renderToStaticMarkup(await context.exports.default())
}

test('homepage lists both co-founded companies without the demo banner', async () => {
  const html = await renderHome()
  assert.match(html, /Previously, I co-founded/)
  assert.match(html, /Schematic<\/a>.*and.*Matcha<\/a>/s)
  assert.doesNotMatch(html, /Company flag|company-flag|href="#"/)
})

test('homepage company links have real destinations, including the local Matcha story', async () => {
  const html = await renderHome()
  for (const url of ['https://vercel.com', 'https://schematichq.com', 'https://www.automox.com', 'https://www.twilio.com', 'https://www.lolliandpops.com', 'https://www.microsoft.com', '/blog/5-years-of-building']) {
    assert.ok(html.includes(`href="${url}"`), `Missing link: ${url}`)
  }
  const posts = JSON.parse(readFileSync(new URL('../content/blog/index.json', import.meta.url), 'utf8'))
  assert.ok(posts.some((post) => post.slug === '5-years-of-building'))
})

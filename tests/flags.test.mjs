import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const source = readFileSync(new URL('../flags.ts', import.meta.url), 'utf8')

// Run the real Flags SDK against a controlled provider, without network access.
function loadFlags(decide) {
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText
  const context = {
    exports: {},
    require(name) {
      if (name === '@flags-sdk/vercel') {
        return { createVercelAdapter: () => () => ({ decide }) }
      }
      return require(name)
    },
  }
  vm.runInNewContext(code, context)
  return context.exports
}

test('missing provider definitions fall back without crashing the homepage', async (t) => {
  t.mock.method(console, 'warn', () => {})
  const flags = loadFlags(async ({ key }) => {
    throw new Error(`Definition not found for flag "${key}"`)
  })
  const request = new Request('http://localhost/')
  assert.equal(await flags.companyFlag(request), false)
  assert.equal(await flags.showPlacesGraph(request), true)
  assert.equal(await flags.showContactSection(request), true)
})

test('provider decisions still override defaults', async () => {
  const flags = loadFlags(async ({ key }) => key === 'company-flag')
  const request = new Request('http://localhost/')
  assert.equal(await flags.companyFlag(request), true)
  assert.equal(await flags.showPlacesGraph(request), false)
  assert.equal(await flags.showContactSection(request), false)
})

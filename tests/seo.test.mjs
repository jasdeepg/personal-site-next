import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import { getBlogPosts } from '../lib/blog.ts'
import { createMetadata, homeMetadata, personSchema, serializeStructuredData, site } from '../lib/site.ts'

function loadRoute(filename) {
  const source = readFileSync(new URL(`../${filename}`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } })
  const context = {
    exports: {}, Response, URL,
    require(name) {
      if (name === '@/lib/blog') return { getBlogPosts }
      if (name === '@/lib/site') return { site }
      throw new Error(`Unexpected import: ${name}`)
    },
  }
  vm.runInNewContext(outputText, context)
  return context.exports
}

test('metadata uses production canonicals, descriptions, and social cards', () => {
  assert.equal(homeMetadata.alternates.canonical, `${site.url}/`)
  for (const post of getBlogPosts()) {
    const metadata = createMetadata({ title: post.title, description: post.description, pathname: `/blog/${post.slug}`, article: true })
    assert.equal(metadata.alternates.canonical, `${site.url}/blog/${post.slug}`)
    assert.equal(metadata.description, post.description)
    assert.equal(metadata.openGraph.type, 'article')
    assert.equal(metadata.twitter.card, 'summary_large_image')
    assert.equal(metadata.authors[0].name, site.name)
  }
})

test('sitemap includes every public article and robots advertises it', () => {
  const entries = loadRoute('app/sitemap.ts').default()
  const urls = new Set(entries.map((entry) => entry.url))
  assert.equal(urls.size, getBlogPosts().length + 2)
  for (const post of getBlogPosts()) assert.ok(urls.has(`${site.url}/blog/${post.slug}`))
  assert.ok(urls.has(`${site.url}/`))
  assert.ok(urls.has(`${site.url}/blog`))
  assert.equal(loadRoute('app/robots.ts').default().sitemap, `${site.url}/sitemap.xml`)
})

test('machine-readable content index lists every article without invented dates', async () => {
  const response = loadRoute('app/llms.txt/route.ts').GET()
  assert.equal(response.headers.get('content-type'), 'text/plain; charset=utf-8')
  const text = await response.text()
  for (const post of getBlogPosts()) assert.ok(text.includes(`${site.url}/blog/${post.slug}`))
  assert.equal(personSchema.name, site.name)
  assert.equal(personSchema.worksFor.name, 'Vercel')
})

test('structured data cannot close its containing script element', () => {
  const dangerous = { headline: '</script><script>alert(1)</script>' }
  const serialized = serializeStructuredData(dangerous)
  assert.ok(!serialized.includes('<'))
  assert.deepEqual(JSON.parse(serialized), dangerous)
})

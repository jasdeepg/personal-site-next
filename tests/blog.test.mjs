import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { getBlogPost, getBlogPosts } from '../lib/blog.ts'

const posts = getBlogPosts()

test('all 10 recovered posts retain unique, valid slugs and article bodies', () => {
  assert.equal(posts.length, 10)
  assert.equal(new Set(posts.map((post) => post.slug)).size, posts.length)
  for (const post of posts) {
    assert.match(post.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(post.title)
    assert.ok(post.description)
    const article = getBlogPost(post.slug)
    assert.ok(article.html.length > 1000)
    assert.doesNotMatch(article.html, /<script\b|\son\w+\s*=|javascript:/i)
    assert.doesNotMatch(article.html, /\/api\/media\//)
  }
})

test('unknown slugs and traversal attempts return no post', () => {
  for (const slug of ['missing-post', '../package', '../../package.json', '']) {
    assert.equal(getBlogPost(slug), null)
  }
})

test('all article images, including responsive variants, exist locally', () => {
  const images = new Set()
  for (const post of posts) {
    const { html } = getBlogPost(post.slug)
    for (const [, source] of html.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
      assert.ok(source.startsWith('/blog/'), `Nonlocal image: ${source}`)
      const local = decodeURIComponent(source)
      assert.ok(existsSync(path.join('public', local)), `Missing image: ${local}`)
      assert.ok(readFileSync(path.join('public', local)).length > 0)
      images.add(local)
    }
  }
  assert.equal(images.size, 68)
})

test('blog routes have no Payload or database imports', () => {
  for (const route of ['app/blog/page.tsx', 'app/blog/[slug]/page.tsx', 'lib/blog.ts']) {
    const source = readFileSync(route, 'utf8')
    assert.doesNotMatch(source, /from ['"](?:payload|@payload-config)|getPayload\(/)
  }
})

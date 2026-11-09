import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { parseFragment } from 'parse5'
import { getBlogPost, getBlogPosts } from '../lib/blog.ts'
import { elements, formatBlog, textContent } from '../scripts/format-blog.mjs'

const attr = (node, name) => node.attrs.find((attribute) => attribute.name === name)?.value

test('all blog content has consistent headings, nested lists, and image loading', () => {
  for (const post of getBlogPosts()) {
    const { html } = getBlogPost(post.slug)
    const nodes = elements(parseFragment(html))
    let previousHeading = 1
    const codeLabels = new Set()
    for (const node of nodes) {
      assert.ok(!attr(node, 'class')?.includes('nestedListItem'), post.slug)
      if (/^h[1-6]$/.test(node.tagName)) {
        const level = Number(node.tagName[1])
        assert.ok(level >= 2 && level <= previousHeading + 1, `${post.slug}: skipped heading level`)
        previousHeading = level
      }
      if (node.tagName === 'img') {
        assert.ok(Number(attr(node, 'width')) > 0 && Number(attr(node, 'height')) > 0)
        assert.equal(attr(node, 'loading'), 'lazy')
        assert.equal(attr(node, 'decoding'), 'async')
        const aspectRatio = Number(attr(node, 'width')) / Number(attr(node, 'height'))
        for (const candidate of (attr(node, 'srcset') ?? '').split(', ')) {
          const dimensions = candidate.match(/-(\d+)x(\d+)\.[^ ]+ /)
          if (dimensions) assert.ok(Math.abs((Number(dimensions[1]) / Number(dimensions[2])) / aspectRatio - 1) < 0.01, `${post.slug}: cropped responsive image`)
        }
      }
      if (node.tagName === 'pre') {
        assert.equal(attr(node, 'tabindex'), '0')
        const label = attr(node, 'aria-label')
        assert.ok(label)
        assert.ok(!codeLabels.has(label), 'Code blocks need distinct accessible names')
        codeLabels.add(label)
      }
    }
    assert.equal(formatBlog(html), html, `${post.slug}: formatter must be idempotent`)
  }
})

test('formatter preserves wording, code indentation, and list-item order', () => {
  const html = '<div><h3>Section</h3><ul><li>Parent</li><li class="nestedListItem"><ul><li>Child</li></ul></li></ul><p><code>for row in rows:</code><br><code>    print(row)</code></p></div>'
  const formatted = formatBlog(html)
  const nodes = elements(parseFragment(formatted))
  assert.equal(nodes.find((node) => node.tagName === 'h2').childNodes[0].value, 'Section')
  const code = nodes.find((node) => node.tagName === 'pre')
  assert.equal(textContent(code), 'for row in rows:\n    print(row)')
  const parent = nodes.find((node) => node.tagName === 'li')
  assert.equal(textContent(parent), 'ParentChild')
  assert.ok(parent.childNodes.some((node) => node.tagName === 'ul'))
})

test('article styles avoid synthetic bullets and undefined color variables', () => {
  const css = readFileSync(new URL('../app/blog/globals.css', import.meta.url), 'utf8')
  assert.doesNotMatch(css, /--color-|li::before/)
  assert.match(css, /white-space: pre;/)
  assert.match(css, /height: auto/)
  assert.match(css, /focus-visible/)
})

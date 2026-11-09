import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseFragment, serialize } from 'parse5'

export function elements(root) {
  return (root.childNodes ?? []).flatMap((node) => node.tagName ? [node, ...elements(node)] : [])
}

export function textContent(node) {
  if (node.nodeName === '#text') return node.value
  if (node.tagName === 'br') return '\n'
  return (node.childNodes ?? []).map(textContent).join('')
}

export function formatBlog(html) {
  const root = parseFragment(html)
  const outer = root.childNodes.filter((node) => node.tagName)
  if (outer.length === 1 && outer[0].tagName === 'div') {
    root.childNodes = outer[0].childNodes
    for (const node of root.childNodes) node.parentNode = root
  }

  for (const wrapper of elements(root).filter((node) => node.tagName === 'li' && node.attrs.some(({ name, value }) => name === 'class' && value.includes('nestedListItem')))) {
    const parent = wrapper.parentNode
    const index = parent.childNodes.indexOf(wrapper)
    const previous = parent.childNodes.slice(0, index).findLast((node) => node.tagName === 'li')
    if (!previous || wrapper.childNodes.some((node) => node.tagName ? !['ul', 'ol'].includes(node.tagName) : textContent(node).trim())) {
      throw new Error('Unexpected nested-list structure; review manually')
    }
    previous.childNodes.push(...wrapper.childNodes)
    for (const child of wrapper.childNodes) child.parentNode = previous
    parent.childNodes.splice(index, 1)
  }

  const headings = elements(root).filter((node) => /^h[2-6]$/.test(node.tagName))
  const offset = headings.length ? Math.min(...headings.map((node) => Number(node.tagName[1]))) - 2 : 0
  for (const heading of headings) {
    heading.tagName = heading.nodeName = `h${Number(heading.tagName[1]) - offset}`
  }

  // Legacy CMS thumbnails crop charts and photos. Keep only matching aspect ratios.
  for (const picture of elements(root).filter((node) => node.tagName === 'picture')) {
    const image = picture.childNodes.find((node) => node.tagName === 'img')
    if (!image) continue
    const attribute = (name) => image.attrs.find((attr) => attr.name === name)?.value
    const width = Number(attribute('width'))
    const height = Number(attribute('height'))
    const candidates = new Map([[width, attribute('src')]])
    for (const source of picture.childNodes.filter((node) => node.tagName === 'source')) {
      const url = source.attrs.find((attr) => attr.name === 'srcset')?.value
      const dimensions = url?.match(/-(\d+)x(\d+)\.[^.]+$/)
      if (dimensions) {
        const [, w, h] = dimensions.map(Number)
        if (w < width && Math.abs((w / h) / (width / height) - 1) < 0.01) candidates.set(w, url)
      }
    }
    picture.childNodes = picture.childNodes.filter((node) => node.tagName !== 'source')
    if (candidates.size > 1) {
      image.attrs = image.attrs.filter((attr) => !['srcset', 'sizes'].includes(attr.name))
      image.attrs.push({ name: 'srcset', value: [...candidates].sort(([a], [b]) => a - b).map(([w, url]) => `${url} ${w}w`).join(', ') })
      image.attrs.push({ name: 'sizes', value: '(max-width: 768px) calc(100vw - 2rem), 42rem' })
    }
  }

  for (const node of elements(root)) {
    node.attrs = node.attrs.filter(({ name, value }) => !(name === 'style' && /^text-align:\s*left;?$/.test(value)))
    if (node.tagName === 'img') {
      for (const [name, value] of [['loading', 'lazy'], ['decoding', 'async']]) {
        if (!node.attrs.some((attr) => attr.name === name)) node.attrs.push({ name, value })
      }
    }
    if (node.tagName === 'p') {
      const children = node.childNodes.filter((child) => child.tagName || textContent(child).trim())
      if (children.length && children.some((child) => child.tagName === 'code') && children.every((child) => ['code', 'br'].includes(child.tagName))) {
        const code = children.map(textContent).join('')
        const block = parseFragment('<pre tabindex="0" role="region" aria-label="Code example"><code></code></pre>').childNodes[0]
        const codeNode = block.childNodes[0]
        codeNode.childNodes = [{ nodeName: '#text', value: code, parentNode: codeNode }]
        const parent = node.parentNode
        block.parentNode = parent
        parent.childNodes.splice(parent.childNodes.indexOf(node), 1, block)
      }
    }
  }
  elements(root).filter((node) => node.tagName === 'pre').forEach((node, index) => {
    node.attrs = node.attrs.filter((attr) => attr.name !== 'aria-label')
    node.attrs.push({ name: 'aria-label', value: `Code example ${index + 1}` })
  })
  return `${serialize(root).trim()}\n`
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const posts = JSON.parse(readFileSync(new URL('../content/blog/index.json', import.meta.url), 'utf8'))
  let changed = 0
  for (const post of posts) {
    const file = new URL(`../content/blog/${post.slug}.html`, import.meta.url)
    const before = readFileSync(file, 'utf8')
    const after = formatBlog(before)
    const normalize = (html) => textContent(parseFragment(html)).replace(/\s+/g, ' ').trim()
    if (normalize(before) !== normalize(after)) throw new Error(`Text changed: ${post.slug}`)
    if (before !== after) {
      changed++
      if (!process.argv.includes('--check')) writeFileSync(file, after)
    }
  }
  console.log(`${posts.length} posts checked; ${changed} need formatting`)
  if (changed && process.argv.includes('--check')) process.exitCode = 1
}

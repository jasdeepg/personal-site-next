import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { getBlogPosts } from '../lib/blog.ts'
import { site } from '../lib/site.ts'

const require = createRequire(import.meta.url)
const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', '0'], {
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let output = ''
let timer
const ready = new Promise((resolve, reject) => {
  timer = setTimeout(() => reject(new Error('Production server did not become ready')), 30000)
  server.on('error', reject)
  server.on('exit', (code) => reject(new Error(`Server exited before readiness: ${code}`)))
  server.stderr.on('data', (chunk) => { output = (output + chunk).slice(-20000) })
  server.stdout.on('data', (chunk) => {
    output = (output + chunk).slice(-20000)
    const address = output.match(/http:\/\/127\.0\.0\.1:(\d+)/)
    if (address && output.includes('Ready')) resolve(address[0])
  })
})

try {
  const base = await ready
  clearTimeout(timer)
  async function get(path, expectedStatus = 200) {
    const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(15000) })
    assert.equal(response.status, expectedStatus, path)
    console.log(`PASS: GET ${path} -> ${response.status}`)
    return response
  }
  const home = await (await get('/')).text()
  const canonical = home.match(/<link rel="canonical" href="([^"]+)"/)
  assert.ok(canonical, 'Homepage canonical missing')
  assert.equal(new URL(canonical[1]).href, new URL('/', site.url).href)
  assert.ok(home.includes('application/ld+json'), 'Homepage structured data missing')
  assert.ok(!home.includes('Company flag is enabled'))
  await get('/blog')
  for (const post of getBlogPosts()) {
    const html = await (await get(`/blog/${post.slug}`)).text()
    assert.ok(html.includes(`href="${site.url}/blog/${post.slug}"`), post.slug)
    assert.ok(html.includes('BlogPosting'), post.slug)
    assert.ok(!html.includes('/api/media/file/'), post.slug)
  }
  const sitemap = await (await get('/sitemap.xml')).text()
  for (const post of getBlogPosts()) assert.ok(sitemap.includes(`/blog/${post.slug}`))
  assert.ok((await (await get('/robots.txt')).text()).includes(`${site.url}/sitemap.xml`))
  await get('/llms.txt')
  const image = await get('/opengraph-image')
  assert.match(image.headers.get('content-type'), /image\/png/)
  for (const path of ['/admin', '/dashboard', '/api/graphql', '/my-route', '/blog/nonexistent-post']) await get(path, 404)
} catch (error) {
  console.error(output)
  throw error
} finally {
  clearTimeout(timer)
  server.kill('SIGTERM')
}

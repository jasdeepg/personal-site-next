import { getBlogPosts } from '@/lib/blog'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

export function GET() {
  const text = [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Main pages',
    '',
    `- [About](${site.url}/): Biography, current work, and places lived.`,
    `- [Blog](${site.url}/blog): Published essays and notes.`,
    '',
    '## Articles',
    '',
    ...getBlogPosts().map((post) => `- [${post.title}](${site.url}/blog/${post.slug}): ${post.description}`),
    '',
  ].join('\n')
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

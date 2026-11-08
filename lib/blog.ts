import { readFileSync } from 'node:fs'
import path from 'node:path'

export interface BlogPost {
  slug: string
  title: string
  description: string
  source: string
}

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

// Content is checked into Git; no CMS or database is needed to build the blog.
export function getBlogPosts(): BlogPost[] {
  return JSON.parse(readFileSync(path.join(contentDirectory, 'index.json'), 'utf8'))
}

export function getBlogPost(slug: string): (BlogPost & { html: string }) | null {
  const post = getBlogPosts().find((entry) => entry.slug === slug)
  if (!post) return null

  return {
    ...post,
    html: readFileSync(path.join(contentDirectory, `${post.slug}.html`), 'utf8'),
  }
}

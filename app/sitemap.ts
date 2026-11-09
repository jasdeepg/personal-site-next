import type { MetadataRoute } from 'next'
import { getBlogPosts } from '@/lib/blog'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/blog', ...getBlogPosts().map(({ slug }) => `/blog/${slug}`)].map((pathname) => ({
    url: new URL(pathname, site.url).href,
  }))
}

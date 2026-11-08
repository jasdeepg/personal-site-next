import type { Metadata } from 'next'
import { createMetadata, site } from '@/lib/site'
import { StructuredData } from '@/components/structured-data'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'
import { getBlogPost, getBlogPosts } from '@/lib/blog'

type Props = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export default async function Post({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return (
    <div className="blog-content pt-8">
      <div className={cn('container')}>
        <article className="prose dark:prose-invert">
          <StructuredData data={{
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${site.url}/blog/${post.slug}#article`,
            headline: post.title,
            description: post.description,
            mainEntityOfPage: `${site.url}/blog/${post.slug}`,
            author: { '@type': 'Person', '@id': `${site.url}/#person`, name: site.name, url: site.url },
            inLanguage: 'en',
          }} />
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          {/* Only reviewed, repository-owned HTML is rendered here. */}
          <div
            className="max-w-[48rem] mx-auto"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return getBlogPosts().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  return createMetadata({
    title: post.title,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    article: true,
  })
}

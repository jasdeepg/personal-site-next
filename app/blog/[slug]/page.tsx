import type { Metadata } from 'next'
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

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `/blog/${post.slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  }
}

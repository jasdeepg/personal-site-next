import RichText from '@/components/RichText'
import { cache } from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next/types'
import { notFound } from 'next/navigation'
import { cn } from '@/lib/utils'


const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return result.docs?.[0] || null
})

export default async function Post({ params }: Props) {
  const resolvedParams = await Promise.resolve(params)
  const { slug } = resolvedParams
  
  const post = await queryPostBySlug({ slug })

  if (!post) {
    notFound()
  }

  return (
    <div className="pt-8">
      <div className={cn('container')}>
        <article className="prose dark:prose-invert">
          <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
          <RichText 
            data={post.content}
            className="max-w-[48rem] mx-auto"
          />
        </article>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    const posts = await payload.find({
      collection: 'posts',
      limit: 1000,
      select: {
        slug: true,
      },
    })
  
    return posts.docs.map((post) => ({
      slug: String(post.slug) // Ensure slug is a string
    }))
  }
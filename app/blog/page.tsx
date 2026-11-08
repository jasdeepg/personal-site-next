import type { Metadata } from 'next/types'
import { cn } from '../../utilities/ui'
import Link from 'next/link'
import { getBlogPosts } from '@/lib/blog'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const posts = getBlogPosts()

  return (
    <div className="pt-8">
    <div className={cn('container')}>
        <ul className="list-disc pl-5 space-y-1">
        {posts.map((result) => (
            <li key={result.slug}>
                <Link className="not-prose" href={`/blog/${result.slug}`}>
                {result.title}
                </Link>
                {result.description && (
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                    — {result.description}
                </span>
                )}
            </li>
            ))}
        </ul>
    </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `jasdeep's blog`,
  }
}
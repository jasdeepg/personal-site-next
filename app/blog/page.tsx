import type { Metadata } from 'next/types'
import { cn } from '../../utilities/ui'
import Link from 'next/link'
import type { Post } from 'payload/generated-types'

import { CollectionArchive } from '@/components/CollectionArchive'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: true,
  })

  return (
    <div className="pt-8">
    <div className={cn('container')}>
        <ul className="list-disc pl-5 space-y-1">
        {posts?.docs
            .filter(result => result?.title && result.title.trim() !== '')
            .map((result: Post, index) => (
            <li key={index}>
                <Link className="not-prose" href={`/blog/${result.slug}`}>
                {result.title}
                </Link>
                {result.meta?.description && (
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                    — {result.meta.description}
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
    title: `Payload Website Template Posts`,
  }
}
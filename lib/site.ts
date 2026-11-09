import type { Metadata } from 'next'

export const site = {
  name: 'Jasdeep Garcha',
  url: 'https://www.jasgarcha.com',
  description: 'Jasdeep Garcha builds at Vercel and co-founded Schematic and Matcha. Notes on startups, products, data, and building things.',
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  url: site.url,
  description: site.description,
  worksFor: { '@type': 'Organization', name: 'Vercel', url: 'https://vercel.com' },
  sameAs: ['https://github.com/jasdeepg'],
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  name: site.name,
  url: site.url,
  author: { '@id': `${site.url}/#person` },
  inLanguage: 'en',
}

export function createMetadata({
  title,
  description,
  pathname,
  article = false,
}: {
  title: string
  description: string
  pathname: string
  article?: boolean
}): Metadata {
  const fullTitle = `${title} | ${site.name}`
  const url = new URL(pathname, site.url).href
  return {
    metadataBase: new URL(site.url),
    title: fullTitle,
    description,
    authors: [{ name: site.name, url: site.url }],
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: 'en_US',
      type: article ? 'article' : 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: site.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export const homeMetadata = createMetadata({
  title: 'Builder at Vercel, co-founder of Schematic and Matcha',
  description: site.description,
  pathname: '/',
})

export const blogMetadata = createMetadata({
  title: 'Blog',
  description: 'Notes and essays by Jasdeep Garcha on startups, product building, growth teams, data, and life.',
  pathname: '/blog',
})

export function serializeStructuredData(data: unknown): string {
  const serialized = JSON.stringify(data)
  if (!serialized) throw new Error('Structured data must be JSON serializable')
  return serialized.replace(/</g, '\\u003c')
}

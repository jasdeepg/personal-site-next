import { blogMetadata, personSchema, websiteSchema } from "@/lib/site"
import { StructuredData } from "@/components/structured-data"
import { Crimson_Text } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import type React from "react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata = blogMetadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={`blog-shell ${crimsonText.variable} font-serif max-w-3xl mx-auto px-4 py-8`}>
        <a href="#blog-main" className="blog-skip-link">Skip to content</a>
        <StructuredData data={[personSchema, websiteSchema]} />
        <header className="mb-12">
          <p className="text-4xl mb-2">hi, i&apos;m jasdeep</p>
          <nav>
            <ul className="flex gap-2 text-lg">
              <li>
                <Link href="/" className="hover:underline">
                  about me
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:underline">
                  blog
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        {children}
        <SpeedInsights />
        <Analytics />
    </div>
  )
}


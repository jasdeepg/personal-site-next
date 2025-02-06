import type { Metadata } from "next"
import { Inter, Crimson_Text } from "next/font/google"
import Link from "next/link"
import "./globals.css"
import type React from "react" // Import React

const inter = Inter({ subsets: ["latin"] })
const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-crimson",
})

export const metadata: Metadata = {
  title: "hi, i'm jasdeep",
  description: "Personal website and blog",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${crimsonText.variable} font-serif max-w-3xl mx-auto px-4 py-8`}>
        <header className="mb-12">
          <h1 className="text-4xl mb-2">hi, i&apos;m jasdeep</h1>
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
      </body>
    </html>
  )
}


import Link from "next/link"
import { PlacesLivedGraph } from "@/components/places-lived-graph"
import { showPlacesGraph, showContactSection } from "@/flags"

export default async function Home() {
  const showGraph = await showPlacesGraph()
  const showContact = await showContactSection()

  return (
    <main className="space-y-8">
      <section>
        <p className="mb-4">
          In the past, I&apos;ve created digital and physical products to deliver content, chocolate, candy, and
          software.
        </p>

        <p className="mb-4">
          I&apos;m currently building at{" "}
          <a href="https://vercel.com" className="font-semibold">
            Vercel
          </a>
          . Previously, I co-founded{" "}
          <a href="https://schematichq.com" className="font-semibold">
            Schematic
          </a>{" "}
          and{" "}
          <Link href="/blog/5-years-of-building" className="font-semibold">
            Matcha
          </Link>
          , and built with smart and talented people at{" "}
          <a href="https://www.automox.com" className="font-semibold">
            Automox
          </a>
          ,{" "}
          <a href="https://www.twilio.com" className="font-semibold">
            Twilio
          </a>
          ,{" "}
          <a href="https://www.lolliandpops.com" className="font-semibold">
            Lolli and Pops
          </a>{" "}
          and{" "}
          <a href="https://www.microsoft.com" className="font-semibold">
            Microsoft
          </a>
          .
        </p>

        <p className="mb-4">
          On this site, I mostly store quick notes/thoughts. The site was
          built with React, NextJS, TailwindCSS, D3, Vercel, and PayloadCMS.
        </p>

        {showContact && (
          <p>
            To contact me directly, you can reach out at <a href="mailto:jasdeepsgarcha@gmail.com">jasdeepsgarcha@gmail.com</a>
          </p>
        )}
      </section>

      {showGraph && (
        <section>
          <h2 className="text-2xl mb-4 text-center">Places I&apos;ve lived</h2>
          <p className="text-center mb-8">(and their distances from where I was born)</p>
          <PlacesLivedGraph />
        </section>
      )}
    </main>
  )
}

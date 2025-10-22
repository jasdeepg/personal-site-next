import { PlacesLivedGraph } from "@/components/places-lived-graph"
import { companyFlag, showPlacesGraph, showContactSection } from "@/flags"

export default async function Home() {
  const showCompanyBanner = await companyFlag()
  const showGraph = await showPlacesGraph()
  const showContact = await showContactSection()

  return (
    <main className="space-y-8">
      {showCompanyBanner && (
        <section className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✨ Company flag is enabled! This section is controlled by the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">company-flag</code>.
          </p>
        </section>
      )}

      <section>
        <p className="mb-4">
          In the past, I&apos;ve created digital and physical products to deliver content, chocolate, candy, and
          software.
        </p>

        <p className="mb-4">
          I co-founded{" "}
          <a href="#" className="font-semibold">
            Schematic
          </a>{" "}
          in 2023, and I built with smart and talented people at{" "}
          <a href="#" className="font-semibold">
            Automox
          </a>
          ,{" "}
          <a href="#" className="font-semibold">
            Twilio
          </a>
          ,{" "}
          <a href="#" className="font-semibold">
            Matcha
          </a>
          ,{" "}
          <a href="#" className="font-semibold">
            Lolli and Pops
          </a>{" "}
          and at{" "}
          <a href="#" className="font-semibold">
            Microsoft
          </a>{" "}
          prior to that.
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


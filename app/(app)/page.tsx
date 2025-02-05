import { PlacesLivedGraph } from "@/components/places-lived-graph"

export default function Home() {
  return (
    <main className="space-y-8">
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
          On this site, I mostly log projects I&apos;ve done in the past and store quick notes/thoughts. The site was
          built with Python, Flask, Foundation, D3, and ButterCMS.
        </p>

        <p>
          To contact me directly, you can reach out at <a href="mailto:jasdeep@example.com">jasdeep@example.com</a>
        </p>
      </section>

      <section>
        <h2 className="text-2xl mb-4 text-center">Places I&apos;ve lived</h2>
        <p className="text-center mb-8">(and their distances from where I was born)</p>
        <PlacesLivedGraph />
      </section>
    </main>
  )
}


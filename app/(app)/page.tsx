import { PlacesLivedGraph } from "@/components/places-lived-graph"
import Image from "next/image"

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
          <a href="https://schematichq.com/" className="font-semibold">
            Schematic
          </a>{" "}
          in 2023, and I built with smart and talented people at{" "}
          <a href="https://www.automox.com/" className="font-semibold">
            Automox
          </a>
          ,{" "}
          <a href="https://www.twilio.com/en-us" className="font-semibold">
            Twilio
          </a>
          ,{" "}
            Matcha
          ,{" "}
          <a href="https://www.lolliandpops.com/" className="font-semibold">
            Lolli and Pops
          </a>{" "}
          and at{" "}
          <a href="https://www.microsoft.com/en-us/" className="font-semibold">
            Microsoft
          </a>{" "}
          prior to that.
        </p>

        <p className="mb-4">
          On this site, I mostly store quick notes/thoughts. The site was
          built with NextJS, React, TailwindCSS, D3, and Payload.
        </p>

        <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          To contact me directly, you can reach out at
          <Image
            src="/email.png"
            width={159}
            height={7}
            alt="Jasdeep's email"
            style={{ verticalAlign: 'middle' }}
          />
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


import React from "react";

export default function Landing() {
  return (
    <>
    <Section header="About Us">
      <p className="leading-relaxed">We are a mountaineering club based in Glasgow and founded in 2021, focusing on the 20s and 30s age groups within the city (but open to all).</p>
    </Section>
    <Section header="Join Us">
      <p>In order to join as a new member...</p>
    </Section>
    <Section header="Upcoming Events">
      <p>Events below</p>
    </Section>
    <Section header="Photos">
      <p>Events below</p>
    </Section>
    </>
  )
}

interface SectionProps {
  header: string,
  children: React.ReactNode,
}

function Section({header, children}: SectionProps) {
  return (
    <section className="container flex flex-wrap mx-auto px-5 py-24 text-gray-600">
      <h1 className="sm:text-3xl text-2xl font-medium mb-4 text-gray-900 md:w-2/5">{header}</h1>
      <div className="md:w-3/5 md:pl-6">
        {children}
      </div>
    </section>
  )
}
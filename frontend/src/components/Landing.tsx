import React from "react";

export default function Landing() {
  return (
    <div className="min-h-full">
    <section className="bg-cover bg-landing bg-bottom bg-fixed h-80"></section>
    <Section header="About Us">
      <Paragraph>We are a mountaineering club based in Glasgow and founded in 2021.  We were created to focus on the 20s and 30s age groups within the city, but are open to all. Our aim is to create a group of friendly, kind and like-minded people who like to get out and have challenging days in the mountains, safely.</Paragraph>
      <Paragraph>Our main activities are harder hill and mountain walking, winter walking, scrambling and easy climbing - together with other outdoor activities in Scotland such as skiing and trail running.</Paragraph>
      <Paragraph>We try to run day trips at least every other weekend, and have weekend trips away to further afield locations. We also have an active social side in the city, with pub trips and indoor climbing/bouldering.</Paragraph>
    </Section>
    <Section header="Join Us">
      <Paragraph>In order to join as a new member...</Paragraph>
      <Paragraph>Any other questions or want to say hello? Get in touch at hello@clydemc.co.uk</Paragraph>
    </Section>
    <Section header="Upcoming Events">
      <Paragraph>Placeholder for the next 5 events</Paragraph>
    </Section>
    <Section header="Photos">
      <Paragraph>Placeholder for recent photo gallery</Paragraph>
    </Section>
    </div>
  )
}

interface SectionProps {
  header: string,
  children: React.ReactNode,
}

function Section({header, children}: SectionProps) {
  return (
    <section className="container flex flex-wrap mx-auto px-5 py-5 items-center text-gray-600 bg-white">
      <h1 className="sm:text-3xl text-2xl font-medium mb-4 text-gray-900 md:w-1/5">{header}</h1>
      <div className="md:w-4/5 md:pl-6">
        {children}
      </div>
    </section>
  )
}

interface ParagraphProps {
  children: React.ReactNode,
}

function Paragraph({children}: ParagraphProps) {
  return (
    <p className="leading-relaxed mb-4">{children}</p>
  )
}
import React from "react";
import { Link } from "react-router-dom";
import LandingEvents from "./LandingEvents";
import LandingPhotos from "./LandingPhotos";

export default function Landing() {
  return (
    <main className="min-h-full">
      <section className="bg-landing bg-cover bg-bottom bg-fixed h-80"></section>
      <Section header="About Us">
        <Paragraph>We are a mountaineering club based in Glasgow and founded in 2022.  We were created to focus on the 20s and 30s age groups within the city, but are open to all. Our aim is to create a group of friendly, kind and like-minded people who like to get out and have challenging days in the mountains, safely.</Paragraph>
        <Paragraph>Our main activities are harder hill and mountain walking, winter walking, scrambling and easy climbing - together with other outdoor activities in Scotland such as skiing and trail running.</Paragraph>
        <Paragraph>We try to run official day trips around every other weekend, and have weekend trips away to further afield locations. We also have an active social side in the city, with pub trips and indoor climbing/bouldering.</Paragraph>
        <Paragraph>The club is still growing and most activities are currently informal between members. We are hoping to start club-backed walks in Spring 2022.</Paragraph>
      </Section>
      <Section header="Join Us">
        <Paragraph>
          If you are interested in joining, the first step is <span className="text-blue-600 hover:text-blue-400"><Link to="/platform">registering on our site.</Link></span> 
          Once you register, you will have access to our internal site and be able to join our Discord, and view more details of our upcoming events.
        </Paragraph>
        <Paragraph>Our membership dues will be set at £36 for the year for 2022/23 - there is also a concessionary rate of £20. This includes affiliation to Mountaineering Scotland. You are welcome to come along on a trip to see if you like the club before becoming a member.</Paragraph>
        <Paragraph>Any other questions or want to say hello? Get in touch at hello@clydemc.org</Paragraph>
      </Section>
      <Section header="Upcoming Events">
        <LandingEvents />
      </Section>
      <Section header="Recent Photos">
        <LandingPhotos />
      </Section>
    </main>
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
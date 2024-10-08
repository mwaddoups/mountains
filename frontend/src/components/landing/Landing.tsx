import React from "react";
import { Link } from "react-router-dom";
import LandingEvents from "./LandingEvents";
import LandingPhotos from "./LandingPhotos";

export default function Landing() {
  return (
    <main className="min-h-full">
      <section className="bg-landing bg-cover bg-bottom bg-fixed h-80"></section>
      <Section header="About Us">
        <Paragraph>
          We are a mountaineering and hiking club based in Glasgow and founded
          in 2022. We were created to focus on the 20s and 30s age groups within
          and around the city, but are open to all. Our aim is to create a group
          of friendly, kind and like-minded people who like to get out and have
          challenging days in the mountains, safely.
        </Paragraph>
        <Paragraph>
          Our main activities are harder hill and mountain hiking, winter
          walking, as well as some scrambling and easy climbing. We also enjoy
          other outdoor activities in Scotland such as skiing and trail running.
        </Paragraph>
        <Paragraph>
          We try to run official club day trips around every other weekend, and
          have weekend trips away to further afield locations. We also have an
          active social side in the city, with pub trips and indoor
          climbing/bouldering.
        </Paragraph>
        <Paragraph>
          In the winter season, we do require some experience of winter walking
          in order to join on our walks - and some of this training can be
          organized as a group through the club.
        </Paragraph>
      </Section>
      <Section header="Join Us">
        <Paragraph>
          If you are interested in joining the club, the first step is
          <span className="text-blue-600 hover:text-blue-400">
            <Link to="/platform"> registering on our site. </Link>
          </span>
          Once you register, you will have access to our internal site and be
          able to join our Discord, and view more details of our upcoming
          events. You are welcome to come along to an event to see if you like
          the club before becoming a member. You have a three month window to
          try up to four events, to see if the club is for you. After this
          period, if you have not formally joined as a paid member, your account
          will be deactivated, and access to Discord lost.{" "}
        </Paragraph>
        <Paragraph>
          Our membership year runs until April, and dues are currently £39 until
          April 2025 (pro rata rates if you join later in the year, and
          concessions are also available). This includes affiliation to
          Mountaineering Scotland, which provides a whole load of membership
          benefits itself too.
        </Paragraph>
        <Paragraph>
          Any other questions or want to say hello? Get in touch at
          hello@clydemc.org
        </Paragraph>
      </Section>
      <Section header="Upcoming Events">
        <LandingEvents />
      </Section>
      <Section header="Recent Photos">
        <LandingPhotos />
      </Section>
    </main>
  );
}

interface SectionProps {
  header: string;
  children: React.ReactNode;
}

function Section({ header, children }: SectionProps) {
  return (
    <section className="container flex flex-wrap mx-auto px-5 py-5 items-center text-gray-600 bg-white">
      <h1 className="sm:text-3xl text-2xl font-medium mb-4 text-gray-900 md:w-1/5">
        {header}
      </h1>
      <div className="md:w-4/5 md:pl-6">{children}</div>
    </section>
  );
}

interface ParagraphProps {
  children: React.ReactNode;
}

function Paragraph({ children }: ParagraphProps) {
  return <p className="leading-relaxed mb-4">{children}</p>;
}

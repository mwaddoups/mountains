import React from "react";
import { Heading, Paragraph, Section } from "./base/Base";
import logo from "../images/logo.png";

export default function Home() {
  return (
    <div>
      <Section>

        <img alt="club logo" className="w-1/2 mx-auto mb-2" src={logo}></img>
        <Heading>Welcome to Clyde Mountaineering Club!</Heading>
        <Paragraph>
          Our club operates on both this site, and on our Discord server. If you haven't used Discord before, 
          it's similar to Whatsapp but allows us to have multiple groups for different chats (avoiding the chaos)!
          You can download the app both on your phone and on your laptop.
        </Paragraph>
        <Paragraph><a target="_blank" rel="noreferrer" className="text-blue-700 hover:text-blue-400" href="https://discord.gg/98K3CafRxk">Join our discord server here!</a></Paragraph>
        <Paragraph>
          You can see our events, members and other information using the sidebar on the side.
        </Paragraph>
        <Paragraph>
          You can adjust or update your profile using your profile link at the top of the page. Please add a picture 
          and feel free to add your mountaineering experience as well! We're hoping that this will make it easier to find
          similar members in future.
        </Paragraph>
        <Paragraph>
          If you like the sound of the club and want to keep coming to walks, as well as help support us and get Mountaineering Scotland membership, 
          you can join us using the link in the sidebar.
        </Paragraph>
      </Section>
      <Section id="walks">
        <Heading>Getting outside!</Heading>
        <Paragraph>
          Our official events will have a designated walk coordinator who will have a rough plan for the day and an idea of an objective. 
          We'll usually give around two weeks notice on these and you're welcome to come along.
        </Paragraph>
        <Paragraph>
          We try to run two official walks a month - you can look at the upcoming events for our current schedule! 
          If you can't see anything coming up it may just be that we haven't posted about it yet - but feel free to pop a message in the Discord.
        </Paragraph>
        <Paragraph>
          If you want to get out more informally, just post up on Discord (#walks-informal) and say where you fancy going and if you have a car. Hopefully other 
          members will then see your post and you should be able to fill seats, split petrol and everything else.
        </Paragraph>
        <Paragraph>
          Please note that any events organized informally are not official club events - so make sure you understand the risks 
          and know how to look after yourself if conditions aren't as expected.
        </Paragraph>
      </Section>
      <Section id="winter-walks">
        <Heading>Winter Walking</Heading>
        <Paragraph>
          In the winter season (roughly November to March) we will try to run winter walks up munros. However, these 
          walks by nature have additional concerns and dangers as well as much tougher equipment requirements for the condtions. We will also 
          probably have less day trips, and more weekend trips to make the most of the short days.
        </Paragraph>
        <Paragraph>
          For our first year of winter walking, we've taken the decision to only open these winter walks to those with some previous winter 
          experience. Our ideal experience would be a 2 day winter skills course, but we essentially require that you have a familiarity with 
          ice axe arrest, winter hazards such as avalanches and walking in crampons.
        </Paragraph>
        <Paragraph>
          These walks will also be smaller groups (6 people max per walk coordinator) and be ran with an expectation that everyone
          is able to take responsibility for their own choices on the hill.
        </Paragraph>
        <Paragraph>
          We don't wish to be exclusionary with this policy at all - we just want to be well prepared for the risks of heading out in winter. We're
          currently looking into trying to arrange a winter skills course with a guide just for the club, and will post details about this in the Discord. 
        </Paragraph>
      </Section>
      <Section id="feedback">
        <Heading>The club and website is a work-in-progress...</Heading>
        <Paragraph>
          The club is still very much a work-in-progress. Any ideas for our future or ways to plan ahead? Let us know in the Discord.
        </Paragraph>
        <Paragraph>
          The website is also still very new and we are actively looking for feedback. Let us know about
          anything, big or small, that you'd like to see added by either posting up on our Feed here, or
          by chatting in the Discord #website channel.
        </Paragraph>
      </Section>
    </div>
  )
}
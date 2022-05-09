import React from "react";
import { Heading, Paragraph, Section } from "./Base";

export default function Home() {
  return (
    <div>
      <Section>
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
      </Section>
      <Section id="walks">
        <Heading>Getting outside!</Heading>
        <Paragraph>
          We will usually have at least one upcoming walk in our Events section! We're still in the early days of formation but are hoping to 
          have a better schedule of organized walks as the weather improves.
        </Paragraph>
        <Paragraph>
          If you want to get out, just post up either in Discord or on this site (on the feed) and say where you fancy going and if you have a car. Hopefully other 
          members will then see your post and you should be able to fill seats, split petrol and everything else.
        </Paragraph>
        <Paragraph>
          Please note that any events organized in this way are not official club events - so make sure you understand the risks 
          and know how to look after yourself if conditions aren't as expected.
        </Paragraph>
      </Section>
      <Section id="feedback">
        <Heading>The club and website is a work-in-progress...</Heading>
        <Paragraph>
          The club is still very much a work-in-progress. Any ideas for our future or ways to plan ahead? Let us know in the discord on the #feedback channel.
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
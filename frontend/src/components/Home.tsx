import React from "react";
import tw from "twin.macro";

const Paragraph = tw.p`my-3 ml-3 tracking-wide font-light`
const Section = tw.div`rounded shadow p-4 mb-4`
const Heading = tw.h1`text-3xl font-bold tracking-tight`

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
        <Paragraph><a target="_blank" className="text-blue-700 hover:text-blue-400" href="https://discord.gg/98K3CafRxk">Join our discord server here!</a></Paragraph>
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
          As the club is still growing and conditions are (somewhat) wintery, we are unlikely to run official walks until we return to
          summer conditions. However, hopefully there are plenty of people out there who are keen to get out with others and do some winter
          walking. 
        </Paragraph>
        <Paragraph>
          If you want to get out, just post up either in Discord or on this site (on the feed) and say where you fancy going and if you have a car. Hopefully other 
          members will then see your post and you should be able to fill seats, split petrol and everything else.
        </Paragraph>
        <Paragraph>
          Please note that any events organized in this way 
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
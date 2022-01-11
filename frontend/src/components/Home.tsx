import React from "react";
import tw from "twin.macro";

const Paragraph = tw.p`my-3 ml-3 tracking-wide font-light`

export default function Home() {
  return (
    <div>
      <div className="rounded shadow p-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to Clyde Mountaineering Club!</h1>
        <Paragraph>
          Our club operates mainly on this site, and on our Discord server.
          There is an invite link to the discord server here.
        </Paragraph>
        <Paragraph>
          You can see our events, members and other information using the sidebar on the side.
        </Paragraph>
        <Paragraph>
          You can adjust or update your profile using your profile link at the top of the page.
        </Paragraph>
      </div>
      <div id="feedback" className="rounded shadow p-4 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">The website is a work-in-progress...</h1>
        <Paragraph>
          The website is still very new and we are actively looking for feedback. Let us know about
          anything, big or small, that you'd like to see added here.
        </Paragraph>
      </div>
    </div>
  )
}
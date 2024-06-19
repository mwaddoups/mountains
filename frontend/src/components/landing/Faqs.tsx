import React from "react";
import tw from "twin.macro";

const QA = tw.div`mb-5 ml-16`;
const Question = tw.h2`text-lg font-medium mb-2`;
const Answer = tw.p`text-sm mt-2`;
const QuestionCategory = tw.h1`text-xl font-medium mb-2`;

export default function Faqs() {
  return (
    <div className="p-2 mt-10 ml-4">
      <QuestionCategory>Trips</QuestionCategory>
      <QA>
        <Question>What does an example day look like?</Question>
        <Answer>
          The standard day we try to run will involve the ascent of at least one
          major summit (often a Munro). It will usually take at least 5 hours,
          and may also involve off-path walking. As this is Scotland, conditions
          are unpredictable and cold, wind and rain tend to play a part.
        </Answer>
        <Answer>
          Example days nearby might be: the ascent of Ben Lomond via Ptarmigan
          Ridge; ascending both the Cobbler and Beinn Ime; or the combination of
          Ben Vorlich and Stuc a'Chroin.
        </Answer>
      </QA>
      <QA>
        <Question>I'm new to hiking - is this the club for me?</Question>
        <Answer>
          That depends. If you're happy with the level of challenge we describe,
          and have appropriate gear, you're likely to have a good time! But the
          best advice we can offer is to read our kit list, get on Discord and
          chat to the members, and make the decision yourself.
        </Answer>
        <Answer>
          If you are totally new and looking for an easier walking experience,
          there are Rambler's clubs around Glasgow that can be great for an
          easier introduction to the hills.
        </Answer>
      </QA>
      <QA>
        <Question>Are your trips guided?</Question>
        <Answer>
          No - our walk organisers are not guides and do not act in any official
          capacity. Whilst they will have navigational skills and be friendly,
          kind and helpful, your personal safety remains your responsibility.
        </Answer>
      </QA>
      <QA>
        <Question>What gear do I need to come on a walk?</Question>
        <Answer>
          We provide a suggested Kit List on our Members Area - register on the
          site to have access.
        </Answer>
        <Answer>
          It's possible to spend a lot of money on kit - but it isn't necessary
          for almost all cases! Stores like Decathlon have a great selection of
          quality, affordable gear, and kit for 3-season use shouldn't be too
          expensive.
        </Answer>
        <Answer>
          For specific gear questions, register on the site and hop on the
          Discord to chat more!
        </Answer>
      </QA>
      <QA>
        <Question>Do I need a car to come on trips?</Question>
        <Answer>
          Not at all! We try to minimize cars on trips and maximize liftsharing
          where possible. Plenty of members have cars so there will usually be a
          way to get a lift near to where you are, and we'll make our best
          efforts to accomodate pickups. Just be prepared to chip in a bit for
          petrol!
        </Answer>
      </QA>
      <QA>
        <Question>
          What are the experience requirements for winter walks?
        </Question>
        <Answer>
          We ask that you've either attended a winter skills course (2 days) or
          have similar experience in ice axe arrest, avalanche awareness and
          walking in crampons. We also ask that you bring an ice axe and
          crampons, and strongly recommend a helmet.
        </Answer>
        <Answer>
          If you don't yet have this experience, we are trying to organize some
          subsidized winter skills days - keep an eye on the Discord server and
          our events to hear more about this.
        </Answer>
      </QA>
      <QuestionCategory>The Club</QuestionCategory>
      <QA>
        <Question>How much is it to join the club?</Question>
        <Answer>
          Our fees for 2023/24 are set at £39 for the year. If you're not able
          to afford this, we can offer a reduced concession rate of £21. We also
          pro-rate this to some extent throughout the year.
        </Answer>
      </QA>
      <QA>
        <Question>What does the club spend the fees on?</Question>
        <Answer>
          Around half of the fees is spent affiliating to Mountaineering
          Scotland. This gives each member individual membership to
          Mountaineering Scotland, which brings a range of benefits including
          free training sessions and discounts at outdoors stores.
        </Answer>
        <Answer>
          The club is a nonprofit, so the other half goes into developing and
          improving the club. We are looking at buying some club kit (such as
          maps, helmets, and perhaps winter gear) that will be available to club
          members. We currently have club helmets, safety gear such as group
          shelters, and navigational aids such as maps and compasses.
        </Answer>
      </QA>
      <QA>
        <Question>
          I want to join but am not in my 20s and 30s - should I look elsewhere?
        </Question>
        <Answer>
          Not at all! We've been aiming at younger age groups as we felt
          existing clubs in Glasgow skewed toward an older demographic. However,
          we are very much open to all!
        </Answer>
      </QA>
      <QA>
        <Question>A note on sharing space on our trips...</Question>
        <Answer>
          We are a welcoming club, and all our club walks and weekends have a
          communal feel, due to the nature of car sharing and the accommodation
          in mountain huts. If for any reason, you feel uncomfortable with this,
          please reach out for a confidential chat with one of the committee
          members. Occasionally women-only dorms are possible, but this depends
          on numbers and huts.
        </Answer>
      </QA>
    </div>
  );
}

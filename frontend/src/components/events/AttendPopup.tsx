import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import {
  Paragraph,
  Button,
  FormInput,
  CancelButton,
  SubHeading,
  FormLabel,
  Bolded,
} from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Modal from "../base/Modal";
import { useAuth } from "../Layout";
import { Event, FullUser, User } from "../../models";
import participationStatementURL from "./ParticipationStatement.md";
import DiscordSelector from "../members/DiscordSelector";
import Loading from "../Loading";
import dateFormat from "dateformat";
import { Link } from "react-router-dom";

export type PopupStep =
  | "participation"
  | "ice"
  | "discord"
  | "members_only"
  | "trial_over";

interface AttendPopupProps {
  currentUser: FullUser;
  event: Event;
  attendEvent: () => void;
  setVisible: (a: boolean) => void;
}

export default function AttendPopup({
  currentUser,
  event,
  attendEvent,
  setVisible,
}: AttendPopupProps) {
  let [currentStep, setCurrentStep] = useState<number>(0);
  let [participationStatement, setParticipationStatement] = useState("");
  let [trialEvents, setTrialEvents] = useState<Array<Event>>([]);
  let [steps, setSteps] = useState<Array<PopupStep>>([]);
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function f() {
      let response = await fetch(participationStatementURL);
      let text = await response.text();
      return text;
    }
    f().then((text) => setParticipationStatement(text));
  }, []);

  useEffect(() => {
    if (currentUser.is_paid) {
      const steps = calcSteps(currentUser, event, []);
      setSteps(steps);
      setLoading(false);
      if (steps.length === 0) {
        // Short-circuit the popup
        attendEvent();
      }
    } else {
      api.get(`events/${event.id}/trialevents/`).then((response) => {
        const trialEvents = response.data;
        setTrialEvents(trialEvents);
        const steps = calcSteps(currentUser, event, trialEvents);
        setSteps(steps);
        setLoading(false);
        if (steps.length === 0) {
          // Short-circuit the popup
          attendEvent();
        }
      });
    }
  }, [attendEvent, currentUser, event]);

  const isFinalStep = steps !== null && currentStep >= steps.length - 1; // Use >= just to catch any weird issues

  const advanceStep = useCallback(() => {
    if (isFinalStep) {
      // Final step - we can toggle attendance and close
      attendEvent();
    } else {
      setCurrentStep((c) => c + 1);
    }
  }, [attendEvent, isFinalStep]);

  if (steps.length === 0 && !loading) {
    return null;
  }

  return (
    <Loading loading={loading}>
      <Modal>
        {steps !== null && (
          <>
            {steps[currentStep] === "ice" && (
              <ICEStep isFinalStep={isFinalStep} advanceStep={advanceStep} />
            )}
            {steps[currentStep] === "trial_over" && (
              <TrialEventsStep
                event={event}
                trialEvents={trialEvents}
                isFinalStep={isFinalStep}
                advanceStep={advanceStep}
              />
            )}
            {steps[currentStep] === "members_only" && (
              <MembersOnlyStep
                isFinalStep={isFinalStep}
                advanceStep={advanceStep}
              />
            )}
            {steps[currentStep] === "discord" && (
              <DiscordStep
                isFinalStep={isFinalStep}
                advanceStep={advanceStep}
              />
            )}
            {steps[currentStep] === "participation" && (
              <>
                <SubHeading>Participation Statement</SubHeading>
                <ClydeMarkdown>{participationStatement}</ClydeMarkdown>
                <Button onClick={advanceStep}>
                  {isFinalStep ? "Yes - I agree. Sign me up!" : "Next"}
                </Button>
              </>
            )}
          </>
        )}
        <CancelButton onClick={() => setVisible(false)}>Cancel</CancelButton>
      </Modal>
    </Loading>
  );
}

function calcSteps(user: User, event: Event, trialEvents: Array<Event>) {
  // Setup the steps
  let steps: Array<PopupStep> = [];
  if (!user.is_paid && trialEvents.length > 4) {
    steps.push("trial_over");
  }
  if (!user.is_paid && event.members_only) {
    // If it's members only,
    steps.push("members_only");
  }

  if (!user.discord_id) {
    steps.push("discord");
  }

  if (event.show_popup || user.in_case_emergency === "") {
    // We just show this for any event which requires participation statement
    steps.push("ice");
  }
  if (event.show_popup) {
    steps.push("participation");
  }

  return steps;
}

interface StepProps {
  isFinalStep: boolean;
  advanceStep: () => void;
}

function ICEStep({ isFinalStep, advanceStep }: StepProps) {
  const { currentUser, refreshUser } = useAuth();
  let [ice, setIce] = useState<string | undefined>(
    currentUser?.in_case_emergency
  );
  let [mobile, setMobile] = useState<string | undefined>(
    currentUser?.mobile_number
  );

  const updateIceAndAdvance = useCallback(
    (event) => {
      event.preventDefault();
      if (currentUser) {
        let newUser = {
          id: currentUser.id,
          in_case_emergency: ice,
          mobile_number: mobile,
        };

        api.patch(`users/${currentUser.id}/`, newUser).then((res) => {
          refreshUser();
          advanceStep();
        });
      }
    },
    [currentUser, refreshUser, ice, mobile, advanceStep]
  );

  return (
    <>
      <SubHeading>Contact Details</SubHeading>
      <Paragraph>
        In order to join any of our events, we need to collect some basic
        information - a mobile number so we can reach you if needed, and
        emergency contact information for you so we know who to contact in case
        of any incidents during club events.
      </Paragraph>
      <Paragraph>
        Please ensure this is up to date by editing if needed below. Note this
        will be saved on file and provided to organisers.
      </Paragraph>
      <FormLabel>Mobile Number</FormLabel>
      <FormInput
        type="string"
        value={mobile}
        placeholder="Enter mobile number..."
        onChange={(event) => setMobile(event.target.value)}
      />
      <FormLabel>Emergency Contact</FormLabel>
      <FormInput
        type="string"
        value={ice}
        placeholder="Enter emergency contact..."
        onChange={(event) => setIce(event.target.value)}
      />
      {ice && mobile ? (
        <Button onClick={updateIceAndAdvance}>
          {isFinalStep
            ? "This is up to date - sign me up!"
            : "This is up to date"}
        </Button>
      ) : (
        <CancelButton className="cursor-default">
          Enter ICE and mobile to continue
        </CancelButton>
      )}
    </>
  );
}

function DiscordStep({ isFinalStep, advanceStep }: StepProps) {
  const { currentUser, refreshUser } = useAuth();

  // This step only advances once Discord is set, when refreshUser is called.

  return (
    <>
      <SubHeading>Joining our Discord server</SubHeading>
      <Paragraph>
        <Bolded>
          To join any of our events, you need to also join our Discord server to
          see any needed updates.
        </Bolded>
      </Paragraph>
      <Paragraph>
        Most updates and discussion for any of our events is on our Discord
        server.
      </Paragraph>
      <Paragraph>
        We also strongly recommend getting the mobile app with notifications so
        we can get in touch more easily.
      </Paragraph>
      <Paragraph>
        More information about this is in the "Home" section, and the link to
        the server is in the sidebar.
      </Paragraph>
      <Paragraph>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://discord.gg/98K3CafRxk"
          className="text-blue-700 hover:text-blue-400"
        >
          An invite link is also clickable here.
        </a>
      </Paragraph>
      <Paragraph>
        <Bolded>
          Please set your username below or in your profile to be able to sign
          up.
        </Bolded>{" "}
      </Paragraph>
      <Paragraph>
        (If your ID is not listed, just drop a message in Discord.)
      </Paragraph>
      {currentUser && (
        <div className="mb-6">
          <DiscordSelector user={currentUser} refreshProfile={refreshUser} />
        </div>
      )}
    </>
  );
}

function MembersOnlyStep({ isFinalStep, advanceStep }: StepProps) {
  return (
    <>
      <SubHeading>Members Only Trip</SubHeading>
      <Paragraph>Our weekend trips and AGM are members only.</Paragraph>
      <Paragraph>
        If you are new to the club, you are welcome to join any of our day walks
        to meet the club members and see if you enjoy the club. We also have
        regular indoor climbing events and socials.
      </Paragraph>
      <Paragraph>
        If you want to join the club, please use the Join Us link on the left
        side of the sidebar. This also helps support the club and allows use of
        shared club kit.
      </Paragraph>
    </>
  );
}

interface TrialEventsStepProps extends StepProps {
  trialEvents: Array<Event>;
  event: Event;
}

function TrialEventsStep({
  event,
  isFinalStep,
  advanceStep,
  trialEvents,
}: TrialEventsStepProps) {
  const notifyCommitteeAndAdvance = useCallback(
    (e) => {
      e.preventDefault();
      api.post(`events/${event.id}/trialevents/`).then((res) => {
        advanceStep();
      });
    },
    [advanceStep, event]
  );
  return (
    <>
      <SubHeading>Trial Events</SubHeading>
      <Paragraph>
        It looks like you may have hit your limit on trial events before joining
        the club. We have you listed as attending the below events.
      </Paragraph>
      {trialEvents.map((e) => (
        <Paragraph className="ml-4">
          <Bolded>{dateFormat(e.event_date, "mmm dd, yyyy")}</Bolded> {e.title}
        </Paragraph>
      ))}
      <Paragraph>
        We would ask that you join the club before attending any further events.
        This a requirement for our liability insurance. For more information and
        to join, follow the link below.
      </Paragraph>
      <Link to={"../../join"}>
        <Button>Join the Club</Button>
      </Link>
      <Paragraph>
        If there's an error in our records (for example, one of these events was
        cancelled or you did not attend) - then please ignore this and go ahead
        to join.
      </Paragraph>
      <Button onClick={notifyCommitteeAndAdvance}>Ignore and Join Event</Button>
    </>
  );
}

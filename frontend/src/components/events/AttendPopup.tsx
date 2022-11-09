import React, { useCallback, useEffect, useState } from "react";
import api from "../../api";
import { Event } from "../../models";
import { Paragraph, Button, FormInput, CancelButton } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Modal from "../base/Modal";
import { useAuth } from "../Layout";
import participationStatementURL from "./ParticipationStatement.md";

type PopupStep = "participation" | "ice" | "discord"

interface AttendPopupProps {
  event: Event,
  toggleCurrentAttendance: () => void;
  setVisible: (a: boolean) => void;
}

export default function AttendPopup({ event, toggleCurrentAttendance, setVisible}: AttendPopupProps) {
  let [currentStep, setCurrentStep] = useState<number>(0)
  let [participationStatement, setParticipationStatement] = useState("");
  let [steps, setSteps] = useState<Array<PopupStep> | null>(null)
  const { currentUser } = useAuth();

  useEffect(() => {
    if (steps === null && currentUser) {
      let pSteps = [];
      if (currentUser && !currentUser.is_on_discord) {
        pSteps.push("discord")
      }
      if (currentUser && event.show_popup) {
        // We just show this for any event which requires participation statement
        pSteps.push("ice")
      }
      if (event.show_popup) {
        pSteps.push("participation")
      }
      setSteps(pSteps as Array<PopupStep>)
    }
  }, [currentUser, steps, event.show_popup])

  useEffect(() => {
    async function f() {
      let response = await fetch(participationStatementURL);
      let text = await response.text();
      return text;
    }
    f().then(text => setParticipationStatement(text))
  }, [])

  const isFinalStep = steps !== null && currentStep >= (steps.length - 1) // Use >= just to catch any weird issues

  const advanceStep = useCallback(() => {
    if (isFinalStep) {
      // Final step - we can toggle attendance and close
      toggleCurrentAttendance();
      setVisible(false);
    } else {
      setCurrentStep(c => c + 1);
    }
  }, [toggleCurrentAttendance, setVisible, isFinalStep])

  return (
    <Modal>
      {steps !== null && (
        <>
        {steps[currentStep] === 'ice' && (
          <ICEStep isFinalStep={isFinalStep} advanceStep={advanceStep}/>
        )}
        {steps[currentStep] === 'discord' && (
          <DiscordStep isFinalStep={isFinalStep} advanceStep={advanceStep}/>
        )}
        {steps[currentStep] === 'participation' && (
          <>
            <ClydeMarkdown>{participationStatement}</ClydeMarkdown>
            <Button onClick={advanceStep}>{isFinalStep ? "Yes - I agree. Sign me up!" : "Next"}</Button>
          </>
        )}
        </>
      )}
      <CancelButton onClick={() => setVisible(false)}>Cancel</CancelButton>
    </Modal>
  )
}

interface StepProps {
  isFinalStep: boolean,
  advanceStep: () => void,
}

function ICEStep({isFinalStep, advanceStep}: StepProps) {
  const { currentUser, refreshUser } = useAuth();
  let [ice, setIce] = useState<string | undefined>(currentUser?.in_case_emergency)

  const updateIceAndAdvance = useCallback(event => {
    event.preventDefault();
    if (currentUser) {
      let newUser = {id: currentUser.id, in_case_emergency: ice};

      api.patch(`users/${currentUser.id}/`, newUser).then(res => {
        refreshUser();
        advanceStep();
      })
    }
  }, [currentUser, refreshUser, ice, advanceStep])

  return (
    <>
      <Paragraph>In order to join on a walk, we need to have emergency contact information for you so we know who to contact in case of any incidents.</Paragraph>
      <Paragraph>Please ensure this is up to date by editing if needed below. Note this will be saved on file and provided to walk leaders.</Paragraph>
      <FormInput type="string" value={ice} onChange={event => setIce(event.target.value)} />
      <Button onClick={updateIceAndAdvance}>{isFinalStep ? "This is up to date - sign me up!" : "This is up to date"}</Button>
    </>
  )
}

function DiscordStep({isFinalStep, advanceStep}: StepProps) {
  const { currentUser, refreshUser } = useAuth();

  const setDiscordAndAdvance = useCallback(event => {
    event.preventDefault();
    if (currentUser) {
      let newUser = {id: currentUser.id, is_on_discord: true};

      api.patch(`users/${currentUser.id}/`, newUser).then(res => {
        refreshUser();
        advanceStep();
      })
    }
  }, [currentUser, refreshUser, advanceStep])

  return (
    <>
      <Paragraph>Most updates and discussion for any of our events is on our Discord server. To join any of our events, you need to also join our Discord server to see any needed updates.</Paragraph>
      <Paragraph>We also strongly recommend getting the mobile app with notifications so we can get in touch more easily.</Paragraph>
      <Paragraph>More information about this is in the "Home" section, and the link to the server is in the sidebar.</Paragraph>
      <Paragraph><a target="_blank" rel="noreferrer" href="https://discord.gg/98K3CafRxk" className="text-blue-700 hover:text-blue-400">
        An invite link is also clickable here.
      </a></Paragraph>
      <Paragraph>Can you confirm you have signed up? We will only ask this once.</Paragraph>
      <Button onClick={setDiscordAndAdvance}>{isFinalStep ? "Yes - I have signed up to Discord. Sign me up!" : "Yes - I have signed up to Discord."}</Button>
    </>
  )
}
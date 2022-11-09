import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Modal from "../base/Modal";
import participationStatementURL from "./ParticipationStatement.md";

type PopupStep = "participation"

interface AttendPopupProps {
  steps: Array<PopupStep>
  toggleCurrentAttendance: () => void;
  setVisible: (a: boolean) => void;
}

export default function AttendPopup({ steps, toggleCurrentAttendance, setVisible}: AttendPopupProps) {
  let [currentStep, setCurrentStep] = useState<number>(0)
  let [participationStatement, setParticipationStatement] = useState("");

  useEffect(() => {
    async function f() {
      let response = await fetch(participationStatementURL);
      let text = await response.text();
      return text;
    }
    f().then(text => setParticipationStatement(text))
  }, [])

  const isFinalStep = currentStep >= (steps.length - 1) // Use >= just to catch any weird issues

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
      {steps[currentStep] === 'participation' && (
        <>
          <ClydeMarkdown>{participationStatement}</ClydeMarkdown>
        </>
      )}
      <Button onClick={advanceStep}>{isFinalStep ? "Yes - sign me up!" : "Next"}</Button>
      <Button onClick={() => setVisible(false)}>Cancel</Button>
    </Modal>
  )
}
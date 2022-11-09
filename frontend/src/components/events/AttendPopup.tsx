import React, { useCallback } from "react";
import { Button } from "../base/Base";
import Modal from "../base/Modal";

interface AttendPopupProps {
  toggleCurrentAttendance: () => void;
  setVisible: (a: boolean) => void;
}

export default function AttendPopup({ toggleCurrentAttendance, setVisible}: AttendPopupProps) {

  const confirmAttend = useCallback(() => {
    toggleCurrentAttendance();
    setVisible(false);
  }, [toggleCurrentAttendance, setVisible])

  return (
    <Modal>
      <p className="text-sm">Please read our participation statement below in full.</p>
      <p className="text-sm font-bold mb-2">
        Clyde Mountaineering Club recognises that climbing and mountaineering are activities
        with a danger of personal injury or death.
        Participants in these activities should be aware of and accept these risks and be 
          responsible for their own actions and involvement.
      </p>
      <p className="text-sm">All walk participants are recommended to bring the below equipment:</p>
      <ul className="text-sm list-disc ml-4">
        <li>Suitable footwear (Hiking boots, usually)</li>
        <li>Waterproofs</li>
        <li>Lunch, food and water for the day</li>
        <li>Headtorch</li>
      </ul>
      <p className="text-sm mb-4">Please ask the walk coordinator or in Discord regarding any questions about equipment.</p>
      <p className="text-sm mb-4">Do you understand the participation statement and our equipment expectations?</p>
      <Button onClick={confirmAttend}>Yes - sign me up!</Button>
      <Button onClick={() => setVisible(false)}>Cancel</Button>
    </Modal>
  )
}
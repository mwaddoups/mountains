import React, { useCallback } from "react";
import tw from "twin.macro";

interface AttendPopupProps {
  toggleAttendance: () => void;
  setVisible: (a: boolean) => void;
}

const AttendButton = tw.button`px-2 py-1 rounded-lg bg-blue-400 text-gray-100 hover:bg-blue-600 mr-4`

export default function AttendPopup({ toggleAttendance, setVisible }: AttendPopupProps) {

  const confirmAttend = useCallback(() => {
    toggleAttendance();
    setVisible(false);
  }, [toggleAttendance, setVisible])

  return (
    <div className="w-3/4 mx-8 mt-1 p-2 border shadow bg-blue-100">
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
      <AttendButton onClick={confirmAttend}>Yes - sign me up!</AttendButton>
      <AttendButton onClick={() => setVisible(false)}>Cancel</AttendButton>
    </div>
  )
}
import dateFormat from "dateformat";
import React from "react";
import { Clock } from "react-bootstrap-icons";

interface CalendarDateProps {
  dateStr: string;
  showTime?: boolean;
}

export default function CalendarDate({ dateStr, showTime }: CalendarDateProps) {
  const date = new Date(dateStr);
  if (showTime === undefined) {
    showTime = false;
  }
  return (
    <div className="w-20 mr-5 flex-none">
      <div className="border-gray-500 border-2 border-t-8 p-1 rounded-lg mx-auto text-center">
        <p className="font-light tracking-tight text-sm leading-tight">{dateFormat(date, "dddd")}</p>
        <p className="font-bold text-2xl leading-tight">{dateFormat(date, "d")}</p>
        <p className="font-light tracking-tight text-sm leading-tight">{dateFormat(date, "mmm yyyy")}</p>
      </div>
      {showTime && <CalendarTime dateStr={dateStr} />}
    </div>
  )
}

interface CalendarTimeProps {
  dateStr: string
}

export function CalendarTime({ dateStr }: CalendarTimeProps) {
  const date = new Date(dateStr);

  return (
    <div className="w-full mx-auto text-center font-semibold mt-1 flex content-center items-center">
      <Clock className="mr-2"/> <span>{dateFormat(date, "HH:MM")}</span>
    </div>
  )
}
import dateFormat from "dateformat";
import React from "react";
import { Calendar, Clock } from "react-bootstrap-icons";

interface CalendarDateProps {
  dateStr: string;
  showTime?: boolean;
}

export default function CalendarDate({ dateStr, showTime }: CalendarDateProps) {
  const date = new Date(dateStr);
  if (showTime === undefined) {
    showTime = true;
  }
  return (
    <div className={"relative w-20 h-20 mr-5" + (showTime ? " mb-10" : "")}>
      <Calendar className="h-full w-full static text-gray-500" />
      <div className="absolute left-0 right-0 top-0 mt-4 mx-auto text-center">
        <div className="font-bold text-3xl">{dateFormat(date, "d")}</div>
        <div className="font-light tracking-tight text-sm">{dateFormat(date, "mmm yyyy")}</div>
      </div>
      {showTime && (
        <div className="w-full mx-auto text-center font-semibold mt-3 flex content-center items-center">
          <Clock className="mr-2"/> <span>{dateFormat(date, "HH:MM")}</span>
        </div>
      )}
    </div>
  )
}
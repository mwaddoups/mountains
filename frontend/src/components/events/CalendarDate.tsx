import dateFormat from "dateformat";
import React from "react";
import { Calendar, Clock } from "react-bootstrap-icons";

interface CalendarDateProps {
  dateStr: string;
}

export default function CalendarDate({ dateStr }: CalendarDateProps) {
  const date = new Date(dateStr);
  return (
    <div className="relative h-20 w-20 mr-5">
      <Calendar className="h-full w-full static text-gray-500" />
      <div className="absolute left-0 right-0 top-0 mt-4 mx-auto text-center">
        <div className="font-bold text-3xl">{dateFormat(date, "d")}</div>
        <div className="font-light tracking-tight text-sm">{dateFormat(date, "mmm yyyy")}</div>
      </div>
      <div className="w-full mx-auto text-center font-semibold mt-3 flex content-center items-center">
        <Clock className="mr-2"/> <span>{dateFormat(date, "HH:MM")}</span>
      </div>
    </div>
  )
}
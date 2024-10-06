import dateFormat from "dateformat";
import { useEffect, useMemo, useState } from "react";
import api from "../../api";
import { Event } from "../../models";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { BadgeProps, colorVariants, Section } from "../base/Base";
import Loading from "../Loading";
import { eventTypeMap } from "./EventList";
import { Link } from "react-router-dom";
import EventsHeader from "./EventsHeader";
import { ArrowLeft, ArrowRight } from "react-bootstrap-icons";

export const CalendarEvent = styled.div(({ $badgeColor }: BadgeProps) => [
  tw`font-light text-sm p-2 rounded bg-gray-500 mb-1 hover:opacity-80`,
  colorVariants[$badgeColor],
]);

// Set this up to get human names for the days
const weekdayMap: Map<number, string> = new Map();
weekdayMap.set(0, "Sunday");
weekdayMap.set(1, "Monday");
weekdayMap.set(2, "Tuesday");
weekdayMap.set(3, "Wednesday");
weekdayMap.set(4, "Thursday");
weekdayMap.set(5, "Friday");
weekdayMap.set(6, "Saturday");

export default function Calendar() {
  const [eventList, setEventList] = useState<Array<Event>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const now: Date = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [month, setMonth] = useState<number>(now.getMonth());

  const weekdays = [1, 2, 3, 4, 5, 6, 0];

  const firstDate = new Date(year, month, 1);
  const lastMonth = new Date(firstDate);
  lastMonth.setDate(-1);
  const nextMonth = new Date(firstDate);
  nextMonth.setDate(40);
  // Calculate the first day on the calendar
  const dates: Array<Date> = useMemo(() => {
    const firstDate = new Date(year, month, 1);
    const numDays = firstDate.getDay() === 0 ? 6 : firstDate.getDay() - 1;
    const startDate = new Date(firstDate);
    startDate.setDate(firstDate.getDate() - numDays);

    // Make the array for all remaining days
    const dates: Array<Date> = [];
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 7; j++) {
        let currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + (7 * i + j));
        dates.push(currentDate);
      }
      if (dates[dates.length - 1].getMonth() !== month) {
        break;
      }
    }
    return dates;
  }, [month, year]);

  useEffect(() => {
    setLoading(true);
    const s_dt = dateFormat(dates[0], "yyyy-mm-dd");
    const e_dt = dateFormat(dates[dates.length - 1], "yyyy-mm-dd");
    api.get(`events/?start_date=${s_dt}&end_date=${e_dt}`).then((response) => {
      setEventList(response.data["results"]);
      setLoading(false);
    });
  }, [dates]);

  return (
    <div className="min-w-[48em]">
      <EventsHeader />
      <Section>
        <div className="flex justify-between items-center">
          <button
            className="flex items-center gap-1 bg-gray-300 rounded p-1 hover:opacity-80"
            onClick={() => {
              setYear(lastMonth.getFullYear());
              setMonth(lastMonth.getMonth());
            }}
          >
            <ArrowLeft /> <span>{dateFormat(lastMonth, "mmmm yyyy")}</span>
          </button>
          <h2 className="font-medium text-lg p-1">
            {dateFormat(firstDate, "mmmm yyyy")}
          </h2>
          <button
            className="flex items-center gap-1 bg-gray-300 rounded p-1 hover:opacity-80"
            onClick={() => {
              setYear(nextMonth.getFullYear());
              setMonth(nextMonth.getMonth());
            }}
          >
            <span>{dateFormat(nextMonth, "mmmm yyyy")} </span>
            <ArrowRight />
          </button>
        </div>
        <Loading loading={loading}>
          <div className="grid grid-cols-7">
            {weekdays.map((ix) => (
              <p className="text-center">{weekdayMap.get(ix)}</p>
            ))}
            {dates.map((dt, ix) => (
              <div
                className={
                  (Math.floor(ix / 7) % 2 === 0 ? "bg-gray-50 " : "") +
                  (dt.getMonth() !== month ? "opacity-50 " : "") +
                  "p-1 min-h-[6em]"
                }
              >
                <p className="w-full text-lg font-light text-right">
                  {dateFormat(dt, "dd")}
                </p>
                {eventList
                  .filter((e) => {
                    const ed = new Date(e.event_date);
                    return (
                      dt.getFullYear() === ed.getFullYear() &&
                      dt.getMonth() === ed.getMonth() &&
                      dt.getDate() === ed.getDate()
                    );
                  })
                  .map((e) => (
                    <Link to={`../${e.id}`}>
                      <CalendarEvent
                        $badgeColor={eventTypeMap[e.event_type][1]}
                      >
                        <span className="font-medium">
                          {dateFormat(e.event_date, "HH:MM")}
                        </span>{" "}
                        {e.title}
                      </CalendarEvent>
                    </Link>
                  ))}
              </div>
            ))}
          </div>
        </Loading>
      </Section>
    </div>
  );
}

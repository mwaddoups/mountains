import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AttendingUser } from "../../models";
import { useAuth } from "../Layout";
import ProfilePicture from "../members/ProfilePicture";
import AttendeeExpanded from "./AttendeeExpanded";
import { ArrowDown, ArrowUp } from "react-bootstrap-icons";

interface AttendeeListProps {
  attendees: Array<AttendingUser>;
  waiting_list: boolean;
  max_attendees: number | null;
  refreshEvent: () => void;
}

export default function AttendeeList({
  attendees: all_attendees,
  waiting_list,
  max_attendees,
  refreshEvent,
}: AttendeeListProps) {
  const [expanded, setExpanded] = useState(false);

  const { currentUser } = useAuth();
  const isEditor =
    currentUser?.is_committee || currentUser?.is_walk_coordinator || false;

  const attendees = all_attendees
    .filter((u) => u.is_waiting_list === waiting_list)
    .sort(
      (u1, u2) =>
        new Date(u1.list_join_date).getTime() -
        new Date(u2.list_join_date).getTime()
    );

  if (attendees.length === 0 && waiting_list) {
    return <></>;
  }

  return (
    <div>
      <div className="flex">
        <h2>
          {waiting_list
            ? `Waiting List (${attendees.length} total)`
            : `Attendees (${attendees.length} total, ${
                max_attendees && max_attendees > 0
                  ? ` ${max_attendees} max`
                  : " no max"
              })`}
        </h2>
        <button onClick={() => setExpanded(!expanded)} className="ml-3">
          {expanded ? <ArrowUp /> : <ArrowDown />}
        </button>
      </div>
      <div className="w-full my-2">
        <div className={expanded ? "w-full" : "flex flex-wrap"}>
          {attendees.map((user) => (
            <div
              key={user.id}
              className={
                "h-auto sm:h-10 " +
                (expanded ? "flex w-full mr-1 my-1 items-center" : "mr-1")
              }
            >
              <Link to={`/platform/members/${user.id}`}>
                <div className="w-10">
                  <ProfilePicture user={user} />
                </div>
              </Link>
              {expanded && (
                <AttendeeExpanded
                  startUser={user}
                  isEditor={isEditor}
                  refreshEvent={refreshEvent}
                />
              )}
            </div>
          ))}
          {attendees.length === 0 && (
            <p className="text-gray-400 h-10">None yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

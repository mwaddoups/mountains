import React from "react";
import { LayerBackward, LayerForward, XSquareFill } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { getName } from "../../methods/user";
import { AttendingUser } from "../../models";
import { useAuth } from "../Layout";
import ProfilePicture from "../members/ProfilePicture";
import AttendeeAdder from "./AttendeeAdder";

interface AttendeeListProps {
    attendees: Array<AttendingUser>;
    expanded: boolean;
    toggleWaitingList: (userId: number) => (() => void);
    toggleAttendance: (userId: number) => (() => void);
}

export default function AttendeeList({ attendees, expanded, toggleWaitingList, toggleAttendance }: AttendeeListProps) {
    const { currentUser } = useAuth();
    return (
        <div className={expanded ? "w-full" : "flex flex-wrap"}>
            {attendees.map(user => (
                <div key={user.id} className={"h-auto sm:h-10" + (expanded ? "flex w-full mr-1 my-1 items-center" : "mr-1")}>
                    <Link to={`/platform/members/${user.id}`}>
                        <div className="w-10"><ProfilePicture user={user} /></div>
                    </Link>
                    {expanded && <>
                        <p className="ml-3 text-sm text-gray-500">
                            <span className={user.is_paid ? "text-blue-500 font-semibold" : "font-semibold"}>{getName(user)}</span> {user.mobile_number ? `(${user.mobile_number})` : ""} {currentUser?.is_committee ? `ICE: ${user.in_case_emergency ? user.in_case_emergency : "None given!"}` : ""}
                        </p>
                        {currentUser?.is_committee && <button title="Toggle waiting list" className="ml-2 rounded bg-gray-300 w-6 h-6 p-1" onClick={toggleWaitingList(user.id)}>{user.is_waiting_list ? <LayerForward /> : <LayerBackward />}</button>}
                        {currentUser?.is_committee && <button title="Remove user" className="ml-2 rounded bg-gray-300 w-6 h-6 p-1" onClick={toggleAttendance(user.id)}><XSquareFill /></button>}
                    </>}
                </div>
            ))
            }
            {expanded && currentUser?.is_committee && <AttendeeAdder toggleAttendance={toggleAttendance} />}
        </div>
    )
}
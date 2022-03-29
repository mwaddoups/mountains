import React from "react";
import { Link } from "react-router-dom";
import { getName } from "../../methods/user";
import { User } from "../../models";
import { useAuth } from "../Layout";
import ProfilePicture from "../members/ProfilePicture";

interface AttendeeListProps {
    attendees: Array<User>;
    expanded: boolean;
}

export default function AttendeeList({ attendees, expanded }: AttendeeListProps) {
    const { currentUser } = useAuth();
    return (
        <div className={expanded ? "w-full" : "flex flex-wrap"}>
            {attendees.map(user => (
                <Link to={`/platform/members/${user.id}`} key={user.id}>
                    <div className={"h-10 " + (expanded ? "flex w-full mr-1 my-1 items-center" : "mr-1")}>
                        <div className="w-10"><ProfilePicture user={user} /></div>
                        {expanded && <p className="ml-3 text-sm text-gray-500">
                            {getName(user)} {user.mobile_number ? `(${user.mobile_number})` : ""} {currentUser?.is_committee ? `ICE: ${user.in_case_emergency ? user.in_case_emergency : "None given!"}` : ""}
                        </p>}
                    </div>
                </Link>
            ))
            }
        </div>
    )
}
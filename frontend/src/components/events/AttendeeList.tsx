import React from "react";
import { Link } from "react-router-dom";
import { getName } from "../../methods/user";
import { User } from "../../models";
import ProfilePicture from "../members/ProfilePicture";

interface AttendeeListProps {
    attendees: Array<User>;
    expanded: boolean;
}

export default function AttendeeList({ attendees, expanded }: AttendeeListProps) {
    return (
        <div className={expanded ? "w-full" : "flex flex-wrap"}>
            {attendees.map(user => (
                <Link to={`../members/${user.id}`} key={user.id}>
                    <div className={"h-10 " + (expanded ? "flex w-full mr-1 my-1 items-center" : "mr-1")}>
                        <div className="w-10"><ProfilePicture user={user} /></div>
                        {expanded && <p className="ml-3 text-sm text-gray-500">{getName(user)} {user.mobile_number ? `(${user.mobile_number})` : ""}</p>}
                    </div>
                </Link>
            ))
            }
        </div>
    )
}
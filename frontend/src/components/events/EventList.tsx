import React from "react";
import { Event } from "../../models";

interface EventListProps {
  event: Event;
}

export default function EventList({ event }: EventListProps) {
  return (
    <div className="w-full shadow p-4">
      {event.title}
    </div>
  )
}
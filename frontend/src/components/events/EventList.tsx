import React, { useCallback, useState } from "react";
import { ArrowClockwise } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event, EventType } from "../../models";
import { describe_date } from "../../utils";
import { Badge, EventHeading, BadgeColor } from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Expander from "../base/Expander";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import AttendPopup from "./AttendPopup";
import CalendarDate, { CalendarTime } from "./CalendarDate";
import AttendeeAdder from "./AttendeeAdder";
import EventAttendButton from "./EventAttendButton";
import Loading from "../Loading";
import EventAdminTools from "./EventAdminTools";
import EventPaymentButton from "./EventPaymentButton";
import PaymentPopup from "./PaymentPopup";

interface EventListProps {
  eventRef: ((node: any) => void) | null;
  event: Event;
}

export const eventTypeMap: Record<EventType, [string, BadgeColor]> = {
  SD: ["Summer Day Walk", "green"],
  SW: ["Summer Weekend", "darkgreen"],
  WD: ["Winter Day Walk", "blue"],
  WW: ["Winter Weekend", "darkblue"],
  CL: ["Climbing", "purple"],
  SO: ["Social", "orange"],
  CM: ["Committee", "pink"],
  XX: ["Other", "pink"],
};

export default function EventList({
  event: initialEvent,
  eventRef,
}: EventListProps) {
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<Event>(initialEvent);
  const [attendPopupVisible, setAttendPopupVisible] = useState(false);
  const [paymentPopupVisible, setPaymentPopupVisible] = useState(false);

  const { currentUser } = useAuth();
  const isEditor =
    currentUser?.is_site_admin || currentUser?.is_walk_coordinator || false;

  const refreshEvent = useCallback(() => {
    setLoading(true);
    api.get(`events/${event.id}/`).then((res) => {
      setEvent(res.data);
      setLoading(false);
    });
  }, [event]);

  const attendEvent = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then((res) => {
      setEvent(res.data);
      setAttendPopupVisible(false);
      if (event.price_id) {
        setPaymentPopupVisible(true);
      }
    });
  }, [event]);

  const leaveEvent = useCallback(() => {
    const attUser = event.attendees.find((u) => u.id === currentUser?.id);
    if (attUser) {
      api.delete(`attendingusers/${attUser.au_id}/`).then(refreshEvent);
    }
  }, [currentUser, event, refreshEvent]);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const isInPast = new Date(event.event_date) < todayDate;
  const attUser = event.attendees.find((u) => u.id === currentUser?.id);

  if (event.is_deleted) {
    return null;
  } else {
    return (
      <Loading loading={loading}>
        <div
          ref={eventRef}
          className={"w-full shadow" + (isInPast ? " striped-gradient" : "")}
        >
          <div className="w-full md:p-4 p-2 mt-4">
            <div className="flex">
              <CalendarDate dateStr={event.event_date} />
              <div className="w-full">
                <div className="md:flex items-center">
                  <div className="md:flex md:items-center">
                    <EventHeading
                      className={isInPast ? "text-gray-500" : "text-teal-900"}
                    >
                      <Link to={`../${event.id}`}>{event.title}</Link>
                    </EventHeading>
                    <Badge
                      className="md:ml-2"
                      $badgeColor={eventTypeMap[event.event_type][1]}
                    >
                      {eventTypeMap[event.event_type][0]}
                    </Badge>
                    {event.members_only && (
                      <Badge $badgeColor="blue">Members Only</Badge>
                    )}
                  </div>
                  <div className="flex items-center">
                    <button onClick={refreshEvent}>
                      <ArrowClockwise className="text-sm ml-2 inline" />
                    </button>
                    {(currentUser?.is_site_admin ||
                      currentUser?.is_walk_coordinator) && (
                      <EventAdminTools
                        event={event}
                        refreshEvent={refreshEvent}
                      />
                    )}
                  </div>
                </div>
                <h6 className="text-[0.6rem] md:text-xs text-gray-400">
                  Created by {getName(event.organiser)}.{" "}
                  {describe_date(event.created_date)}
                </h6>
                <CalendarTime dateStr={event.event_date} />
              </div>
            </div>
            <div className="w-full mt-2">
              <Expander>
                <ClydeMarkdown>{event.description}</ClydeMarkdown>
              </Expander>
              <div className="mt-4">
                <AttendeeList
                  attendees={event.attendees}
                  waiting_list={false}
                  max_attendees={event.max_attendees}
                  refreshEvent={refreshEvent}
                />
                <AttendeeList
                  attendees={event.attendees}
                  waiting_list={true}
                  max_attendees={event.max_attendees}
                  refreshEvent={refreshEvent}
                />
                {isEditor && (
                  <AttendeeAdder
                    eventId={event.id}
                    refreshEvent={refreshEvent}
                  />
                )}
                <EventAttendButton
                  event={event}
                  attendEvent={() => setAttendPopupVisible(true)}
                  leaveEvent={leaveEvent}
                />
                {event.price_id && attUser && !attUser.is_waiting_list && (
                  <EventPaymentButton event={event} attUser={attUser} />
                )}
              </div>
            </div>
          </div>
        </div>
        {paymentPopupVisible &&
          attUser &&
          !attUser.is_trip_paid &&
          !attUser.is_waiting_list && (
            <PaymentPopup
              event={event}
              attUser={attUser}
              setPaymentPopupVisible={setPaymentPopupVisible}
            />
          )}
        {attendPopupVisible && (
          <AttendPopup
            event={event}
            attendEvent={attendEvent}
            setVisible={setAttendPopupVisible}
          />
        )}
      </Loading>
    );
  }
}

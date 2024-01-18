import React, { useCallback, useState } from "react";
import {
  ArrowClockwise,
  ClipboardPlus,
  DoorClosedFill,
  DoorOpenFill,
  Envelope,
  PencilFill,
  Trash,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import api from "../../api";
import { getName } from "../../methods/user";
import { Event, EventType } from "../../models";
import { describe_date } from "../../utils";
import {
  Button,
  Badge,
  EventHeading,
  BadgeColor,
  CancelButton,
  Bolded,
  Paragraph,
} from "../base/Base";
import ClydeMarkdown from "../base/ClydeMarkdown";
import Expander from "../base/Expander";
import { useAuth } from "../Layout";
import AttendeeList from "./AttendeeList";
import AttendPopup, { PopupStep } from "./AttendPopup";
import CalendarDate, { CalendarTime } from "./CalendarDate";
import Modal from "../base/Modal";
import AttendeeAdder from "./AttendeeAdder";
import EventAttendButton from "./EventAttendButton";

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
  const [event, setEvent] = useState<Event>(initialEvent);
  const [attendPopupVisible, setAttendPopupVisible] = useState(false);
  const [attendPopupSteps, setAttendPopupSteps] = useState<Array<PopupStep>>(
    []
  );
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReminder, setConfirmReminder] = useState(false);

  const { currentUser } = useAuth();
  const isEditor =
    currentUser?.is_committee || currentUser?.is_walk_coordinator || false;

  const refreshEvent = useCallback(() => {
    api.get(`events/${event.id}/`).then((res) => setEvent(res.data));
  }, [event]);

  const attendEvent = useCallback(() => {
    api.patch(`events/${event.id}/attend/`).then((res) => setEvent(res.data));
  }, [event]);

  const toggleSignup = useCallback(() => {
    api
      .patch(`events/${event.id}/`, { signup_open: !event.signup_open })
      .then((res) => setEvent(res.data));
  }, [event]);

  const deleteEvent = useCallback(() => {
    api.patch(`events/${event.id}/`, { is_deleted: true }).then((res) => {
      setConfirmDelete(false);
      setEvent(res.data);
    });
  }, [event]);

  const sendReminder = useCallback(() => {
    api.post(`events/${event.id}/reminderemail/`, {}).then((res) => {
      setConfirmReminder(false);
    });
  }, [event]);

  const showAttendPopup = useCallback(() => {
    // Setup the steps
    let steps: Array<PopupStep> = [];
    if (currentUser && !currentUser.is_paid && event.members_only) {
      // If it's members only,
      steps.push("members_only");
    }

    if (currentUser && !currentUser.is_on_discord) {
      steps.push("discord");
    }

    if (currentUser && event.show_popup) {
      // We just show this for any event which requires participation statement
      steps.push("ice");
    }
    if (event.show_popup) {
      steps.push("participation");
    }

    if (steps.length > 0) {
      setAttendPopupSteps(steps);
      setAttendPopupVisible(true);
    } else {
      attendEvent();
    }
  }, [attendEvent, setAttendPopupVisible, currentUser, event]);

  const leaveEvent = useCallback(() => {
    const attUser = event.attendees.find((u) => u.id === currentUser?.id);
    if (attUser) {
      api.delete(`attendingusers/${attUser.au_id}/`).then(refreshEvent);
    }
  }, [currentUser, event, refreshEvent]);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const isInPast = new Date(event.event_date) < todayDate;

  if (event.is_deleted) {
    return null;
  } else {
    return (
      <>
        {confirmDelete && (
          <Modal>
            <Paragraph>Are you sure you want to delete this event?</Paragraph>
            <Paragraph>
              <Bolded>{event.title}</Bolded>
            </Paragraph>
            <Button onClick={deleteEvent}>Delete event</Button>
            <CancelButton onClick={() => setConfirmDelete(false)}>
              Cancel
            </CancelButton>
          </Modal>
        )}
        {confirmReminder && (
          <Modal>
            <Paragraph>
              Are you sure you want to send an email reminder?
            </Paragraph>
            <Paragraph>
              Please only do this <Bolded>after</Bolded> you have created the
              walk thread in #trips
            </Paragraph>
            <Paragraph>
              This will email <Bolded>{event.attendees.length}</Bolded> people.
            </Paragraph>
            <Button onClick={sendReminder}>Send reminder</Button>
            <CancelButton onClick={() => setConfirmReminder(false)}>
              Cancel
            </CancelButton>
          </Modal>
        )}
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
                    {(currentUser?.is_committee ||
                      currentUser?.is_walk_coordinator) && (
                      <>
                        <Link to={`../${event.id}/edit`}>
                          <PencilFill className="text-sm ml-2 inline" />
                        </Link>
                        <Link to={`../${event.id}/copy`}>
                          <ClipboardPlus className="text-sm ml-2 inline" />
                        </Link>
                        <span onClick={toggleSignup} className="cursor-pointer">
                          {event.signup_open ? (
                            <DoorOpenFill className="text-green-500 text-sm ml-2 inline" />
                          ) : (
                            <DoorClosedFill className="text-red-500 text-sm ml-2 inline" />
                          )}
                        </span>
                        <span
                          onClick={() => setConfirmReminder(true)}
                          className="cursor-pointer"
                        >
                          <Envelope className="text-sm ml-2 inline" />
                        </span>
                        <span
                          onClick={() => setConfirmDelete(true)}
                          className="cursor-pointer"
                        >
                          <Trash className="text-sm ml-2 inline" />
                        </span>
                      </>
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
                  attendEvent={showAttendPopup}
                  leaveEvent={leaveEvent}
                />
              </div>
            </div>
          </div>
        </div>
        {attendPopupVisible && (
          <AttendPopup
            steps={attendPopupSteps}
            attendEvent={attendEvent}
            setVisible={setAttendPopupVisible}
          />
        )}
      </>
    );
  }
}

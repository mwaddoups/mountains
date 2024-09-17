import {
  ClipboardPlus,
  DoorClosedFill,
  DoorOpenFill,
  Envelope,
  PencilFill,
  Trash,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import { Event } from "../../models";
import { useCallback, useState } from "react";
import api from "../../api";
import Modal from "../base/Modal";
import { Bolded, Button, CancelButton, Paragraph } from "../base/Base";

interface EventAdminToolsProps {
  event: Event;
  refreshEvent: () => void;
}

export default function EventAdminTools({
  event,
  refreshEvent,
}: EventAdminToolsProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReminder, setConfirmReminder] = useState(false);

  const toggleSignup = useCallback(() => {
    api
      .patch(`events/${event.id}/`, { signup_open: !event.signup_open })
      .then(refreshEvent);
  }, [event, refreshEvent]);

  const deleteEvent = useCallback(() => {
    api.patch(`events/${event.id}/`, { is_deleted: true }).then((res) => {
      setConfirmDelete(false);
      refreshEvent();
    });
  }, [event, refreshEvent]);

  const sendReminder = useCallback(() => {
    api.post(`events/${event.id}/reminderemail/`, {}).then((res) => {
      setConfirmReminder(false);
      refreshEvent();
    });
  }, [event, refreshEvent]);

  return (
    <>
      <Link to={`../${event.id}/edit`} data-tooltip="Edit event">
        <PencilFill className="text-sm ml-2 inline" />
      </Link>
      <Link to={`../${event.id}/copy`} data-tooltip="Copy event">
        <ClipboardPlus className="text-sm ml-2 inline" />
      </Link>
      <span
        onClick={toggleSignup}
        className="cursor-pointer"
        data-tooltip="Close/Open signup"
      >
        {event.signup_open ? (
          <DoorOpenFill className="text-green-500 text-sm ml-2 inline" />
        ) : (
          <DoorClosedFill className="text-red-500 text-sm ml-2 inline" />
        )}
      </span>
      <span
        onClick={() => setConfirmReminder(true)}
        className="cursor-pointer"
        data-tooltip="Send reminder email"
      >
        <Envelope className="text-sm ml-2 inline" />
      </span>
      <span
        onClick={() => setConfirmDelete(true)}
        className="cursor-pointer"
        data-tooltip="Delete event"
      >
        <Trash className="text-sm ml-2 inline" />
      </span>
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
            Please only do this <Bolded>after</Bolded> you have created the walk
            thread in #trips
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
    </>
  );
}

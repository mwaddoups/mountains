import dateFormat from "dateformat";
import { Event } from "../../models";
import { Button, CancelButton } from "../base/Base";
import { useAuth } from "../Layout";

interface EventAttendButtonProps {
  event: Event;
  attendEvent: () => void;
  leaveEvent: () => void;
}

export default function EventAttendButton({
  event,
  attendEvent,
  leaveEvent,
}: EventAttendButtonProps) {
  const { currentUser } = useAuth();

  // is_open is calculated server-side to avoid clock abuse
  if (!event.is_open) {
    if (!event.signup_open) {
      // If it's manually closed
      return <CancelButton>Signup closed</CancelButton>;
    } else if (event.signup_open_date) {
      // It has a signup open date, but its in the future
      return (
        <CancelButton>
          Signup opens at{" "}
          {dateFormat(event.signup_open_date, "dd mmm yyyy HH:MM")}
        </CancelButton>
      );
    } else {
      // Should never happen (since is_open is calcualted server side) but just in case
      return <CancelButton>Signup closed</CancelButton>;
    }
  }

  // If already attending, leave
  const attendingUser = event.attendees.find((u) => u.id === currentUser?.id);
  if (attendingUser) {
    return <Button onClick={leaveEvent}>Leave</Button>;
  }

  const hasWaitingList =
    event.max_attendees &&
    event.max_attendees > 0 &&
    event.attendees.filter((u) => u.is_waiting_list).length >=
      event.max_attendees;

  if (hasWaitingList)
    return <Button onClick={attendEvent}>Join Waiting List</Button>;
  else {
    return <Button onClick={attendEvent}>Attend</Button>;
  }
}

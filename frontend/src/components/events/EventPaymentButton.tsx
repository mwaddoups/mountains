import { useResolvedPath } from "react-router-dom";
import { AttendingUser, Event } from "../../models";
import { Button, CancelButton } from "../base/Base";
import { useCallback } from "react";
import api from "../../api";

interface EventPaymentButtonProps {
  attUser: AttendingUser;
  event: Event;
}

export default function EventPaymentButton({
  attUser,
  event,
}: EventPaymentButtonProps) {
  // Ensures we strip the path of any event Id
  const resolvedPath = useResolvedPath(`../${event.id}`);

  const triggerPayment = useCallback(() => {
    const return_domain = window.location.origin + resolvedPath.pathname;

    const userData = {
      price_id: event.price_id,
      au_id: attUser.au_id,
      return_domain,
    };

    api.post("payments/event/", userData).then((res) => {
      // Redirect to checkout
      window.location.assign(res.data);
    });
  }, [resolvedPath, event, attUser]);

  if (attUser.is_trip_paid) {
    return (
      <CancelButton className="pointer-events-none">You've paid!</CancelButton>
    );
  } else {
    return <Button onClick={triggerPayment}>Pay Now</Button>;
  }
}

import { useResolvedPath, useSearchParams } from "react-router-dom";
import { AttendingUser, Event } from "../../models";
import { Bolded, Button, CancelButton, Paragraph } from "../base/Base";
import { useCallback } from "react";
import api from "../../api";
import Modal from "../base/Modal";

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
  const [searchParams, setSearchParams] = useSearchParams();

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

  return (
    <>
      {attUser.is_trip_paid ? (
        <CancelButton className="pointer-events-none">
          You've paid!
        </CancelButton>
      ) : (
        <Button onClick={triggerPayment}>Pay Now</Button>
      )}
      {searchParams.get("success") && (
        <Modal>
          <Paragraph>
            Thank you for your payment for <Bolded>{event.title}</Bolded>!
          </Paragraph>
          <Paragraph>Your status as paid should be updated shortly.</Paragraph>
          <Button onClick={() => setSearchParams({})}>Return to event</Button>
        </Modal>
      )}
    </>
  );
}

import { useEffect, useState } from "react";
import { AttendingUser, Event } from "../../models";
import { Bolded, CancelButton, Paragraph, SubHeading } from "../base/Base";
import Modal from "../base/Modal";
import EventPaymentButton from "./EventPaymentButton";

interface PaymentPopupProps {
  event: Event;
  attUser: AttendingUser;
  setPaymentPopupVisible: (a: boolean) => void;
}

export default function PaymentPopup({
  event,
  attUser,
  setPaymentPopupVisible,
}: PaymentPopupProps) {
  const [buttonDisabledSecs, setButtonDisabledSecs] = useState<number>(0);

  useEffect(() => {
    if (buttonDisabledSecs > 0) {
      setTimeout(() => {
        setButtonDisabledSecs(buttonDisabledSecs - 1);
      }, 1000);
    }
  }, [buttonDisabledSecs]);

  return (
    <Modal>
      <SubHeading>Trip Payment</SubHeading>
      <Paragraph>
        <Bolded>You are signed up and your place is held!</Bolded>
      </Paragraph>
      <Paragraph>
        Now the trip requires payment to retain your place. Please pay for the
        trip now if you are able - it will reduce the work for our organisers.
      </Paragraph>
      <EventPaymentButton event={event} attUser={attUser} />
      <Paragraph className="mt-5">
        If you are unable to pay until later on, there is a payment link on the
        event - but please only use this if you have to.
      </Paragraph>
      {buttonDisabledSecs > 0 ? (
        <CancelButton disabled className="opacity-70">
          {`(${buttonDisabledSecs}s) Pay in the next few days...`}
        </CancelButton>
      ) : (
        <CancelButton onClick={() => setPaymentPopupVisible(false)}>
          Pay in the next few days...
        </CancelButton>
      )}
    </Modal>
  );
}

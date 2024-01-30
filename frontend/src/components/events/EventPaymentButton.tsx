import { AttendingUser } from "../../models";
import { Button, CancelButton } from "../base/Base";

interface EventPaymentButtonProps {
  attUser: AttendingUser;
}

export default function EventPaymentButton({
  attUser,
}: EventPaymentButtonProps) {
  if (attUser.is_trip_paid) {
    return <CancelButton>You've paid!</CancelButton>;
  } else {
    return <Button>Pay Now</Button>;
  }
}

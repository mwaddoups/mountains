import { Button, FormContainer, Heading, Paragraph } from "../base/Base";
import { useCallback } from "react";
import { useAuth } from "../Layout";
import api from "../../api";

export default function DormantReturn() {
  const { currentUser, refreshUser } = useAuth();
  const makeActive = useCallback(() => {
    currentUser &&
      api
        .patch(`users/${currentUser.id}/`, { is_dormant: false })
        .then((res) => refreshUser());
  }, [currentUser, refreshUser]);
  return (
    <FormContainer className="text-center">
      <Heading>Welcome back to the club!</Heading>

      <Paragraph>
        It's good to see you returning to CMC. Your account was marked as
        inactive as we hadn't seen any activity on your account for a good
        while.
      </Paragraph>

      <Paragraph>
        You will likely have been removed from our Discord as well. You can
        rejoin by following the link on our platform.
      </Paragraph>

      <Paragraph>
        All your other information should have been retained - but please check
        your profile and update anything which has changed!
      </Paragraph>

      <Button onClick={makeActive}>Reactivate your account!</Button>
    </FormContainer>
  );
}

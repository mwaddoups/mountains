import {
  CashCoin,
  LayerBackward,
  LayerForward,
  XSquareFill,
} from "react-bootstrap-icons";
import { AttendingUser } from "../../models";
import { getName } from "../../methods/user";
import { useCallback, useState } from "react";
import api from "../../api";
import Modal from "../base/Modal";
import {
  Bolded,
  SmallButton,
  SmallCancelButton,
  Paragraph,
} from "../base/Base";

interface ExpandedAttendeeProps {
  startUser: AttendingUser;
  isEditor: boolean;
  refreshEvent: () => void;
}

export default function AttendeeExpanded({
  startUser,
  isEditor,
  refreshEvent,
}: ExpandedAttendeeProps) {
  const [user, setUser] = useState<AttendingUser>(startUser);
  const [removeConfirmation, setRemoveConfirmation] = useState<boolean>(false);

  const togglePaid = useCallback(() => {
    api
      .patch(`attendingusers/${user.au_id}/`, {
        is_trip_paid: !user.is_trip_paid,
      })
      .then((res) => setUser(res.data));
  }, [user]);

  const toggleWaitingList = useCallback(() => {
    api
      .patch(`attendingusers/${user.au_id}/`, {
        is_waiting_list: !user.is_waiting_list,
      })
      .then(refreshEvent);
  }, [user, refreshEvent]);

  const removeUser = useCallback(() => {
    setRemoveConfirmation(false);
    api.delete(`attendingusers/${user.au_id}/`).then(refreshEvent);
  }, [user, refreshEvent]);

  return (
    <>
      <p className="ml-3 text-sm text-gray-500">
        <span
          className={
            user.is_walk_coordinator
              ? "text-orange-500 font-semibold mr-1"
              : user.is_committee
              ? "text-pink-800 font-semibold mr-1"
              : user.is_paid
              ? "text-blue-500 font-semibold mr-1"
              : "font-semibold mr-1"
          }
        >
          {getName(user)}
        </span>
        {user.is_trip_paid ? (
          <CashCoin className="inline mr-1 text-green-500" />
        ) : (
          ""
        )}
        <span className="mr-1">
          {user.mobile_number ? `(${user.mobile_number})` : ""}
        </span>
        {isEditor
          ? `ICE: ${
              user.in_case_emergency ? user.in_case_emergency : "None given!"
            }`
          : ""}
      </p>
      {isEditor && (
        <>
          <button
            title="Toggle waiting list"
            className="ml-2 rounded bg-gray-300 w-6 h-6 p-1"
            onClick={toggleWaitingList}
          >
            {user.is_waiting_list ? <LayerForward /> : <LayerBackward />}
          </button>
          <button
            title="Toggle driving"
            className="ml-2 rounded bg-gray-300 w-6 h-6 p-1"
            onClick={togglePaid}
          >
            <CashCoin />
          </button>
          <button
            title="Remove user"
            className="ml-2 rounded bg-gray-300 w-6 h-6 p-1"
            onClick={() => setRemoveConfirmation(true)}
          >
            <XSquareFill />
          </button>
          {removeConfirmation && (
            <Modal>
              <div className="mx-auto w-full text-center">
                <Paragraph>
                  Are you sure you want to remove{" "}
                  <Bolded>{getName(user)}</Bolded>?
                </Paragraph>
                <SmallButton className="mr-5" onClick={removeUser}>
                  Remove
                </SmallButton>
                <SmallCancelButton onClick={() => setRemoveConfirmation(false)}>
                  Cancel
                </SmallCancelButton>
              </div>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

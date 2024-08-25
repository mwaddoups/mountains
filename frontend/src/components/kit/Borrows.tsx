import { KitBorrow } from "../../models";
import { useAuth } from "../Layout";
import { Heading, Section, SmallButton } from "../base/Base";
import { getName } from "../../methods/user";
import dateFormat from "dateformat";
import { useCallback } from "react";
import api from "../../api";

interface BorrowsParams {
  borrowList: Array<KitBorrow>;
  setBorrowList: (x: KitBorrow[]) => void;
}
export default function Borrow({ borrowList, setBorrowList }: BorrowsParams) {
  const { currentUser } = useAuth();

  const setApproved = useCallback(
    (borrow: KitBorrow) => {
      return () => {
        api
          .patch(`kit/borrow/${borrow.id}/`, { is_approved: true })
          .then((res) => {
            const newBorrowList = borrowList
              .filter((b) => b !== borrow)
              .concat([res.data]);
            setBorrowList(newBorrowList);
          });
      };
    },
    [borrowList, setBorrowList]
  );

  return (
    <Section>
      <Heading>Kit Borrows</Heading>
      <table className="text-sm font-light w-full text-center">
        <thead>
          <tr>
            {currentUser?.is_site_admin && <th scope="col"></th>}
            <th scope="col">Status</th>
            <th scope="col">Requested on</th>
            <th scope="col">Borrower</th>
            <th scope="col">Description</th>
            <th scope="col">ID</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
          </tr>
        </thead>
        <tbody>
          {borrowList
            .sort(
              (k1, k2) =>
                new Date(k2.request_date).getTime() -
                new Date(k1.request_date).getTime()
            )
            .map((kb) => (
              <tr key={kb.id} className={kb.is_approved ? "" : "bg-slate-200"}>
                {currentUser?.is_site_admin && (
                  <td>
                    {kb.is_approved ? (
                      ""
                    ) : (
                      <SmallButton onClick={setApproved(kb)}>
                        Approve
                      </SmallButton>
                    )}
                  </td>
                )}
                <td>{kb.is_approved ? "Approved" : "Pending"}</td>
                <td>{dateFormat(kb.request_date, "HH:MM,  mmm dS, yyyy")}</td>
                <td>{getName(kb.user)}</td>
                <td>{kb.kit.description}</td>
                <td>{kb.kit.text_id}</td>
                <td>{dateFormat(kb.start_date, "mmm dS, yyyy")}</td>
                <td>{dateFormat(kb.end_date, "mmm dS, yyyy")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Section>
  );
}

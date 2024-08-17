import React, { useCallback, useEffect, useMemo, useState } from "react";
import api from "../api";
import { User } from "../models";
import Activity from "./Activity";
import {
  Bolded,
  Button,
  Heading,
  LI,
  Paragraph,
  Section,
  Table,
  Td,
  UList,
} from "./base/Base";
import Loading from "./Loading";
import dateFormat from "dateformat";

export default function Committee() {
  const [userList, setUserList] = useState<Array<User>>([]);

  useEffect(() => {
    api.get("users/").then((response) => {
      setUserList(response.data);
    });
  }, [setUserList]);

  let numApproved = useMemo(() => {
    return userList.filter((u) => u.is_approved).length;
  }, [userList]);

  let uniqueExpiries = useMemo(() => {
    let expiries = userList.map((u) => u.membership_expiry);
    return [...new Set(expiries)];
  }, [userList]);

  return (
    <div>
      <Section>
        <Heading>Member Statistics</Heading>
        <Paragraph>{numApproved} approved users on site!</Paragraph>
        {uniqueExpiries.map(
          (expiry) =>
            expiry && (
              <Paragraph key={expiry}>
                {userList.filter((u) => u.membership_expiry === expiry).length}{" "}
                paid members (ending {expiry})!
              </Paragraph>
            )
        )}
      </Section>
      <Section>
        <Heading>Admin Info</Heading>
        <Paragraph>
          You should be able to create events on the event page, and edit them
          as a committee member.
        </Paragraph>
        <Paragraph>
          You can add or remove users to events, or move them back and forth to
          the waiting list.
        </Paragraph>
      </Section>
      <Section>
        <Heading>Membership watch</Heading>
        <Paragraph>
          We can see a list of users who have attended walks below. We only
          count walks or weekend events here, but note it won't include very old
          events from before we introduced the type system.
        </Paragraph>
        <MembershipWatch />
      </Section>
      <Section>
        <Heading>Unpaid List</Heading>
        <Paragraph>
          This lists all the users on any weekend trip in the future which
          haven't paid yet.
        </Paragraph>
        <UnpaidWeekends />
      </Section>
      <Section>
        <Heading>Inactive Users</Heading>
        <Paragraph>
          This shows non-member users who haven't logged in or been to an event
          in over 3 months. Note we only started monitoring login in 2024, and
          activity in 2023.
        </Paragraph>
        <InactiveUsers />
      </Section>
      <Activity />
    </div>
  );
}

type MemberWatch = {
  name: string;
  count: number;
};

function MembershipWatch() {
  const [members, setMembers] = useState<Array<MemberWatch> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(() => {
    api.get(`events/needsmembership`).then((res) => {
      setMembers(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Loading loading={loading}>
      {members === null ? (
        <Button onClick={loadMembers}>Load members</Button>
      ) : (
        members.map((mw) => (
          <Paragraph key={mw.name}>
            <Bolded>{mw.name}</Bolded> {mw.count}{" "}
            {mw.count > 1 ? "walks" : "walk"}.
          </Paragraph>
        ))
      )}
    </Loading>
  );
}

function UnpaidWeekends() {
  const [unpaidList, setUnpaidList] = useState<Record<
    string,
    Array<string>
  > | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUnpaid = useCallback(() => {
    api.get(`events/unpaidweekends`).then((res) => {
      setUnpaidList(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Loading loading={loading}>
      {unpaidList !== null ? (
        Object.keys(unpaidList).map((event_name, ix) => (
          <div key={ix}>
            <Paragraph>
              <Bolded>{event_name}</Bolded>
            </Paragraph>
            <UList>
              {unpaidList[event_name].map((name, jx) => (
                <LI key={jx}>{name}</LI>
              ))}
            </UList>
          </div>
        ))
      ) : (
        <Button onClick={fetchUnpaid}>Load Unpaid</Button>
      )}
    </Loading>
  );
}

type InactiveUser = {
  id: number;
  name: string;
  last_login: string;
  discord: string;
  last_activity: string;
};

function InactiveUsers() {
  const [members, setMembers] = useState<Array<InactiveUser> | null>(null);
  const [loading, setLoading] = useState(false);

  const loadMembers = useCallback(() => {
    api.get(`users/inactive`).then((res) => {
      setMembers(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <Loading loading={loading}>
      {members === null ? (
        <Button onClick={loadMembers}>Load inactive</Button>
      ) : (
        <div>
          <Paragraph>
            <Bolded>Found {members.length} inactive members!</Bolded>
          </Paragraph>
          <Table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Last Login</th>
                <th scope="col">Last Activity</th>
                <th scope="col">Discord Name</th>
              </tr>
            </thead>
            <tbody>
              {members
                .sort(
                  (u1, u2) =>
                    new Date(u1.last_login || "2021-01-01").getTime() -
                    new Date(u2.last_login || "2021-01-01").getTime()
                )
                .map((user) => (
                  <tr key={user.id}>
                    <Td>{user.name}</Td>

                    <Td>
                      {user.last_login
                        ? dateFormat(user.last_login, "mmm dd, yyyy")
                        : "Pre-2024"}
                    </Td>
                    <Td>
                      {user.last_activity
                        ? dateFormat(user.last_activity, "mmm dd, yyyy")
                        : "Pre-2023"}
                    </Td>
                    <Td>{user.discord || ""}</Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </Loading>
  );
}

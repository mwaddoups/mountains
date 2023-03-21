import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { User } from "../models";
import Activity from "./Activity";
import { Bolded, Heading, Paragraph, Section } from "./base/Base";
import Loading from "./Loading";

export default function Committee() {
  const [userList, setUserList] = useState<Array<User>>([]);

  useEffect(() => {
    api.get("users/").then(response => {
      setUserList(response.data);
    });
  }, [setUserList])

  let numApproved = useMemo(() => {
    return userList.filter(u => u.is_approved).length
  }, [userList])

  let numMembers = useMemo(() => {
    return userList.filter(u => u.is_paid).length
  }, [userList])

  return  (
    <div>
      <Section>
        <Heading>Member Statistics</Heading>
        <Paragraph>{numApproved} approved users on site!</Paragraph> 
        <Paragraph>{numMembers} paid members!</Paragraph> 
      </Section>
      <Section>
        <Heading>Admin Info</Heading>
        <Paragraph>You should be able to create events on the event page, and edit them as a committee member.</Paragraph>
        <Paragraph>You can add or remove users to events, or move them back and forth to the waiting list.</Paragraph>
      </Section>
      <Section>
        <Heading>Membership watch</Heading>
        <Paragraph>
          We can see a list of users who have attended walks below. We only count walks or weekend events here, but note it won't 
          include very old events from before we introduced the type system.
        </Paragraph>
        <MembershipWatch />
      </Section>
      <Activity />
    </div>
  )
}

type MemberWatch = {
  name: string,
  count: number,
}

function MembershipWatch() {
  const [members, setMembers] = useState<Array<MemberWatch>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get(`events/needsmembership`).then(res => {
      setMembers(res.data);
      setLoading(false);
    })
  }, [])

  return <Loading loading={loading}>
    {members.map(mw => <Paragraph key={mw.name}><Bolded>{mw.name}</Bolded> {mw.count} {mw.count > 1 ? "walks" : "walk"}.</Paragraph>)}
  </Loading>
}
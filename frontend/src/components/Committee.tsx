import React, { useEffect, useMemo, useState } from "react";
import api from "../api";
import { User } from "../models";
import Activity from "./Activity";
import { Heading, Paragraph, Section } from "./base/Base";

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
      <Activity />
    </div>
  )
}
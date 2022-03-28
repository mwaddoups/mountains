import React, { useEffect, useMemo, useState } from "react";
import tw from "twin.macro";
import api from "../api";
import { User } from "../models";

const Paragraph = tw.p`my-3 ml-3 tracking-wide font-light`
const Section = tw.div`rounded shadow p-4 mb-4`
const Heading = tw.h1`text-3xl font-bold tracking-tight`

export default function Committee() {
  const [userList, setUserList] = useState<Array<User>>([]);

  useEffect(() => {
    api.get("users/").then(response => {
      setUserList(response.data);
    });
  }, [setUserList])

  const numApproved = useMemo(() => {
    return userList.filter(u => u.is_approved).length
  }, [userList])

  return  (
    <div>
      <Section>
        <Heading>Member Statistics</Heading>
        <Paragraph>{numApproved} approved members!</Paragraph> 
        <Paragraph>{userList.length - numApproved} members in sign-up but not yet approved.</Paragraph> 
      </Section>
      <Section>
        <Heading>Admin Info</Heading>
        <Paragraph>You should be able to create events on the event page, and edit them as a committee member.</Paragraph>
      </Section>
    </div>
  )
}
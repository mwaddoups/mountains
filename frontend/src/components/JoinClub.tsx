import React, { useCallback, useState } from "react";
import api from "../api";
import { getName } from "../methods/user";
import { Heading, Section, Paragraph, FormLabel, FormInput, FormSelect, FormButton } from "./Base";
import { useAuth } from "./Layout";

export default function JoinClub() {
  // TODO: Check they have entered email, phone number, full name
  return (
    <>
    <Section>
      <Heading>Joining the Club</Heading>
      <Paragraph>
        You need to join the club in order to come on our walks and events. 
        If you're new to the club you are welcome to come along for a trial walk before committing to membership - or catch us at one of the city events. 
      </Paragraph>
      <Paragraph>
        Membership helps fund the club and goes towards purchasing club kit (that you can borrow) and running costs. 
        Our membership also includes Mountaineering Scotland membership, which has a host of benefits including discounts at outdoor stores, access to talks and training and mountaineering insurance.
      </Paragraph>
      <Paragraph>
        The cost is £35, or £25 for those that can't afford the full fee - this choice is up to you. Our membership year runs until April 1, 2023 so the fee will cover you until then - if you join after October we will do a reduced rate to cover the year.
      </Paragraph>
      <Paragraph>
        If you are already a Mountaineering Scotland member get in touch with the treasurer (treasurer@clydemc.org) before paying as we should be able to offer a reduced rate.
      </Paragraph>
      <Paragraph>
        To join, just complete the form below and follow the instructions to make the bank transfer to our club account.
      </Paragraph>
    </Section>
    <Section>
      <Heading> Join Now! </Heading>
      <Paragraph> Just fill in the details below and the treasurer will be in touch with our bank details and the pro-rated payment amount.</Paragraph>
      <JoinClubForm />
    </Section>
    </>
  )
}

function JoinClubForm() {
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [membership, setMembership] = useState<"regular" | "concession">("regular");
  const [mscot, setMscot] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { currentUser } = useAuth();

  const handleJoin = useCallback(event => {
    event.preventDefault();
    const name = currentUser ? getName(currentUser) : "<Missing user>";
    const email = currentUser?.email;

    const userData = {name, email, dob, address, mobile, membership, mscot};

    api.post("users/join/", userData).then(() => {
      setSubmitted(true);
    })
  }, [dob, address, mobile, membership, mscot, currentUser])

  return submitted 
      ? (
        <>
        <Paragraph>
          Thank you for joining! Our bank details are below. These have been emailed to you too.
        </Paragraph>
        <Paragraph>Name: Clyde Mountaineering Club</Paragraph>
        <Paragraph>Account: 23104562</Paragraph>
        <Paragraph>Sort Code: 80-22-60</Paragraph>
        <Paragraph>Reference: [your initials] + "membership"</Paragraph>
        <Paragraph>Amount: £{membership === "regular" ? "35" : "25"}</Paragraph>
        <Paragraph>
          The treasurer should be in touch to confirm receipt! Any questions, get in touch at treasurer@clydemc.org.
        </Paragraph>
        </>
      )
      : (
        <form className="ml-2 mt-2" onSubmit={handleJoin}>
          <FormLabel>Date of Birth</FormLabel>
          <FormInput type="text" value={dob} onChange={e => setDob(e.target.value)} />
          <FormLabel>Address</FormLabel>
          <FormInput type="text" value={address} onChange={e => setAddress(e.target.value)} />
          <FormLabel>Mobile Number</FormLabel>
          <FormInput type="text" value={mobile} onChange={e => setMobile(e.target.value)} />

          <FormLabel>Membership Type</FormLabel>
          <FormSelect value={membership} onChange={e => setMembership(e.target.value as any)}>
            <option value="regular">Regular (£35 per year)</option>
            <option value="concession">Concession (£25 per year)</option>
          </FormSelect>

          <FormLabel>If you are already a Mountaineering Scotland member, what is your membership number?</FormLabel>
          <FormInput type="text" value={mscot} onChange={e => setMscot(e.target.value)} />

          <FormLabel>By submitting this form, I agree to pay the membership dues to Clyde Mountaineering Club. I also consent to my personal information being passed to Mountaineering Scotland in order to set up my membership.</FormLabel> 
          <FormButton type="submit">Submit</FormButton>
        </form>
    )
}
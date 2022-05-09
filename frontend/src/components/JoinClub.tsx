import React from "react";
import { Heading, Section, Paragraph, FormLabel, FormInput, FormSelect, FormButton } from "./Base";

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
  return (
    <form className="ml-2 mt-2">
      <FormLabel>Date of Birth</FormLabel>
      <FormInput type="text" />
      <FormLabel>Address</FormLabel>
      <FormInput type="text"/>

      <FormLabel>Membership Type</FormLabel>
      <FormSelect>
        <option value="regular">Regular (£35 per year)</option>
        <option value="concession">Concession (£25 per year)</option>
      </FormSelect>

      <FormLabel>If you are already a Mountaineering Scotland member, what is your membership number?</FormLabel>
      <FormInput type="text"/>

      <FormLabel>By submitting this form, I consent to my personal information being passed to Mountaineering Scotland in order to set up my membership.</FormLabel> 
      <FormButton>Submit</FormButton>
    </form>
  )
}
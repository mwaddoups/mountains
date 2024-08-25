import React, { useState, useCallback, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../../api";
import {
  FormButton,
  FormCancelButton,
  FormContainer,
  FormInput,
  FormLabel,
  FormTextArea,
  Italic,
  Paragraph,
  SubHeading,
  Error,
} from "../base/Base";
import { useAuth } from "../Layout";

export default function ProfileEditor() {
  const { currentUser, refreshUser } = useAuth();
  const [firstName, setFirstName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [emergencyContact, setEmergencyContact] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  // The current user shouldnt change while editing - this handles
  // making sure we update it when it does change.
  useEffect(() => {
    setFirstName(currentUser ? currentUser.first_name : "");
    setSurname(currentUser ? currentUser.last_name : "");
    setMobileNumber(currentUser ? currentUser.mobile_number : "");
    setAbout(currentUser ? currentUser.about : "");
    setEmergencyContact(
      currentUser ? currentUser?.in_case_emergency || "" : ""
    );
  }, [currentUser]);

  const approved = currentUser?.is_approved;

  const updateUser = useCallback(
    (event) => {
      event.preventDefault();
      if (currentUser) {
        let newUser = Object.assign({}, currentUser);
        newUser.first_name = firstName;
        newUser.last_name = surname;
        newUser.about = about;
        newUser.mobile_number = mobileNumber;
        newUser.in_case_emergency = emergencyContact;

        api.put(`users/${currentUser.id}/`, newUser).then((res) => {
          refreshUser();
          setSubmitted(true);
        });
      }
    },
    [
      about,
      currentUser,
      firstName,
      surname,
      mobileNumber,
      refreshUser,
      emergencyContact,
    ]
  );

  if (currentUser && submitted && approved) {
    return <Navigate to={`../${currentUser.id}`} />;
  }

  return (
    <FormContainer>
      <SubHeading>{approved ? "Edit Profile" : "Add Profile"}</SubHeading>
      {!approved && (
        <Paragraph>
          Thanks for signing up! Let us know a bit more about you below...
        </Paragraph>
      )}
      <form onSubmit={updateUser} className="mt-4">
        <div className="flex w-full">
          <div className="flex-grow mr-2">
            <FormLabel htmlFor="firstName">First Name*</FormLabel>
            <FormInput
              type="string"
              id="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className="flex-grow ml-2">
            <FormLabel htmlFor="surname">Surname*</FormLabel>
            <FormInput
              type="string"
              id="surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
          </div>
        </div>
        <FormLabel htmlFor="about">Bio</FormLabel>
        <Paragraph className="ml-2">
          <Italic>
            Write about yourself and what brings you to our club!{" "}
            {!approved && (
              <span>
                {" "}
                This will be visible to all members once you are approved, but
                you can change it later on. Feel free to leave this blank for
                now.
              </span>
            )}
          </Italic>
        </Paragraph>
        <FormTextArea
          className="h-80"
          id="about"
          value={about}
          onChange={(event) => setAbout(event.target.value)}
        />
        <FormLabel htmlFor="mobile">Mobile Number</FormLabel>
        <Paragraph className="ml-2">
          <Italic>
            Optional. We make this visible to all members if you provide it as
            it's useful for organising walks and quickly getting in touch with
            people.
          </Italic>
        </Paragraph>
        <FormInput
          type="string"
          id="mobile"
          value={mobileNumber}
          onChange={(event) => setMobileNumber(event.target.value)}
        />
        {approved && (
          <>
            <FormLabel htmlFor="emergencyContact">Emergency Contact</FormLabel>
            <Paragraph className="ml-2">
              <Italic>
                Please provide if joining for an event - include phone number
                and relationship/other notes.
              </Italic>
            </Paragraph>
            <FormInput
              type="string"
              id="emergencyContact"
              value={emergencyContact}
              onChange={(event) => setEmergencyContact(event.target.value)}
            />
          </>
        )}
        <div className="flex justify-between">
          <FormButton type="submit">
            {approved ? "Update" : "Submit"}
          </FormButton>
          <Link to={currentUser ? `../${currentUser.id}` : ""}>
            <FormCancelButton>Cancel</FormCancelButton>
          </Link>
        </div>
      </form>
      {submitted && !approved && (
        <Error>
          Thank you for submitting! It looks like some required information may
          be missing - double check and edit your answers above! If all looks
          good you should be approved for access shortly.
        </Error>
      )}
    </FormContainer>
  );
}

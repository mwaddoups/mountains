import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import tw from 'twin.macro';
import api from "../../api";
import { getName } from "../../methods/user";
import { FullUser } from "../../models";
import { useAuth } from "../Layout";
import ProfilePicture from "./ProfilePicture";
import Loading from "../Loading";
import Badges from "./Badges";
import ExperienceRecord from "./ExperienceRecord";

interface ProfileButtonProps {
  $loading?: boolean;
}

const ProfileButton = styled.button(({ $loading }: ProfileButtonProps) => [
  tw`rounded-lg bg-blue-500 p-1.5 text-gray-100 text-sm`,
  $loading && tw`bg-gray-500`,
])

export default function Profile() {
  const [user, setUser] = useState<FullUser | null>(null);
  const { memberId } = useParams();
  const { currentUser } = useAuth();

  const isUser = currentUser && user && (currentUser.id === user.id);

  useEffect(() => {
    api.get(`users/${memberId}`).then(response => {
      let foundUser = response.data;
      setUser(foundUser);
    });
  }, [setUser, memberId])

  return (
    <Loading loading={(!user)}>
      <div className="flex h-full">
        <div className="flex-auto p-4 rounded shadow mr-3">
          <div className="flex">
            <div>
              <h1 className={"text-5xl font-medium" + (user ? "" : " invisible")}>
                {user ? getName(user) : "Loading name..."}
              </h1>
            </div>
            {isUser && (
              <div className="ml-4 mt-auto mb-1">
                <Link to="../edit"><ProfileButton>Edit profile</ProfileButton></Link>
              </div>
            )}
          </div>
          <div className="pt-4">
            <Badges user={user} />
          </div>
          <div className="h-40 min-h-40 mt-4">
            <h2 className="text-3xl font-medium">About</h2>
            {user?.about 
              ? <p>{user.about}</p> 
              : <p className="italic text-gray-500"> Nothing here yet!</p>}
          </div>
          <div>
            <h2 className="text-3xl font-medium">Experience</h2>
            {user?.experience?.map(exp => <ExperienceRecord exp={exp} />)}
          </div>
        </div>
        <div className="ml-auto rounded shadow ">
          <div className="w-64 h-64 p-4">
            <ProfilePicture imageUrl={user?.profile_picture} />
          </div>
          <div className="flex justify-center">
            {isUser && (
              <ProfileUploaderButton />
            )}
          </div>
        </div>
      </div>
    </Loading>
  )
}


function ProfileUploaderButton() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onButtonClick = useCallback(() => {
    fileInput?.current?.click();
  }, [fileInput])

  const onChangeFile = useCallback(event => {
    setLoading(true);
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    console.log(file);
    let form = new FormData();
    form.append('file', file);
    api.patch('users/profile/', form).then(res => setLoading(false));
  }, [setLoading])

  return (
    <>
    <input type="file" ref={fileInput} className="hidden" onChange={onChangeFile} />
    <ProfileButton onClick={onButtonClick} $loading={loading}>Upload profile picture</ProfileButton>
    </>
  )
}
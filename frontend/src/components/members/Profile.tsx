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
  tw`rounded-lg bg-blue-400 p-1.5 text-gray-100 text-xs lg:text-sm hover:bg-blue-600`,
  $loading && tw`bg-gray-500`,
])

export default function Profile() {
  const [user, setUser] = useState<FullUser | null>(null);
  const [editingExperience, setEditingExperience] = useState(false);
  const [pictureChanged, setPictureChanged] = useState(false);
  const { memberId } = useParams();
  const { currentUser } = useAuth();

  const isUser = currentUser && user && (currentUser.id === user.id);

  useEffect(() => {
    api.get(`users/${memberId}/`).then(response => {
      let foundUser = response.data;
      setUser(foundUser);
      setPictureChanged(false);
    });
  }, [setUser, memberId, editingExperience, pictureChanged, setPictureChanged])

  return (
    <Loading loading={(!user)}>
      <div className="flex h-full lg:flex-row-reverse flex-wrap lg:flex-nowrap">
        <div className="ml-auto p-2 lg:p-4 rounded lg:shadow block flex-auto flex lg:block items-center">
          <div className="w-32 lg:w-64 lg:h-64">
            <ProfilePicture imageUrl={user?.profile_picture} />
          </div>
          <div className="flex justify-center h-8 m-2">
            {isUser && (
              <ProfileUploaderButton setPictureChanged={setPictureChanged}/>
            )}
          </div>
        </div>
        <div className="flex-auto w-full p-2 lg:p-4 rounded lg:shadow block mr-3">
          <div className="sm:flex">
            <div>
              <h1 className={"text-3xl lg:text-5xl font-medium lg:truncate" + (user ? "" : " invisible")}>
                {user ? getName(user) : "Loading name..."}
              </h1>
            </div>
            {isUser && (
              <div className="sm:ml-4 mt-auto mb-1">
                <Link to="../edit"><ProfileButton>Edit profile</ProfileButton></Link>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 font-bold tracking-wide">{user?.mobile_number}</p>
          <div className="pt-4 flex">
            <Badges user={user} />
          </div>
          <div className="h-40 min-h-40 mt-4">
            <h2 className="text-xl lg:text-3xl font-medium">About</h2>
            {user?.about 
              ? <p className="text-sm lg:text-base">{user.about}</p> 
              : <p className="italic text-gray-500"> Nothing here yet!</p>}
          </div>
          <div>
            <div className="flex">
              <h2 className="text-xl lg:text-3xl font-medium mr-3">Experience</h2>
              {isUser && <ProfileButton
                onClick={() => setEditingExperience(!editingExperience)}>
                  {editingExperience ? "Finish Editing" : "Edit"}
              </ProfileButton>}
            </div>
            {editingExperience && <p className="text-xs text-gray-500">
              This is just to give a rough idea of experience and ability, 
              mainly either for leaders or to help people find others with similar experience.
              </p>}
              {user?.experience
                ? <ExperienceRecord experiences={user.experience} editable={editingExperience} />
                : <p className="italic text-gray-500">Nothing here yet!</p>
              }
          </div>
        </div>
      </div>
    </Loading>
  )
}

interface ProfileUploaderButtonProps {
  setPictureChanged: (a: boolean) => void;
}

function ProfileUploaderButton({ setPictureChanged }: ProfileUploaderButtonProps) {
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
    api.patch('users/profile/', form).then(res => {
      setLoading(false);
      setPictureChanged(true);
    });
  }, [setLoading])

  return (
    <>
    <input type="file" ref={fileInput} className="hidden" onChange={onChangeFile} />
    <ProfileButton onClick={onButtonClick} $loading={loading}>Upload profile picture</ProfileButton>
    </>
  )
}

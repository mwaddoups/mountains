import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import tw from "twin.macro";
import api from "../../api";
import { getName } from "../../methods/user";
import { BasicEvent, FullUser } from "../../models";
import { useAuth } from "../Layout";
import ProfilePicture from "./ProfilePicture";
import Loading from "../Loading";
import { BadgesLong } from "./Badges";
import ExperienceRecord from "./ExperienceRecord";
import AdminTools from "./AdminTools";
import dateFormat from "dateformat";
import DiscordSelector from "./DiscordSelector";

interface ProfileButtonProps {
  $loading?: boolean;
}

export const ProfileButton = styled.button(
  ({ $loading }: ProfileButtonProps) => [
    tw`rounded-lg bg-blue-400 p-1.5 text-gray-100 text-xs lg:text-sm hover:bg-blue-600`,
    $loading && tw`bg-gray-500`,
  ]
);

export default function Profile() {
  const [user, setUser] = useState<FullUser | null>(null);
  const [editingExperience, setEditingExperience] = useState(false);
  const [attendedEvents, setAttendedEvents] = useState<Array<BasicEvent>>([]);
  const { memberId } = useParams();
  const { currentUser, refreshUser } = useAuth();

  const isUser = currentUser && user && currentUser.id === user.id;

  const refreshProfile = useCallback(() => {
    api.get(`users/${memberId}/`).then((response) => {
      let foundUser = response.data;
      setUser(foundUser);

      api
        .post("events/attendedby/", { userId: foundUser.id })
        .then((response) => {
          setAttendedEvents(response.data);
        });
      if (isUser) {
        refreshUser();
      }
    });
  }, [setUser, memberId, isUser, refreshUser]);

  useEffect(() => {
    refreshProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Loading loading={!user}>
      <AdminTools user={user} refreshUser={refreshProfile} />
      <div className="flex h-full lg:flex-row-reverse flex-wrap lg:flex-nowrap">
        <div className="ml-auto p-2 lg:p-4 rounded lg:shadow flex-auto flex lg:block items-center">
          <div className="w-32 h-32 lg:w-64 lg:h-64">
            <ProfilePicture user={user} />
          </div>
          <div className="flex justify-center h-8 m-2">
            {isUser && (
              <ProfileUploaderButton refreshProfile={refreshProfile} />
            )}
          </div>
        </div>
        <div className="flex-auto w-full p-2 lg:p-4 rounded lg:shadow block mr-3">
          <div className="sm:flex">
            <div>
              <h1
                className={
                  "text-3xl lg:text-5xl font-medium lg:truncate" +
                  (user ? "" : " invisible")
                }
              >
                {user ? getName(user) : "Loading name..."}
              </h1>
            </div>
            {isUser && (
              <div className="sm:ml-4 mt-auto mb-1">
                <Link to="../edit">
                  <ProfileButton>Edit profile</ProfileButton>
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center">
            <p className="text-sm text-gray-500 font-bold tracking-wide">
              {user?.mobile_number}
            </p>
            {user?.discord_id && (
              <DiscordSelector user={user} refreshProfile={refreshProfile} />
            )}
          </div>
          <div className="pt-4 flex">
            <BadgesLong user={user} />
          </div>
          <div className="min-h-[10rem] mt-4">
            <h2 className="text-xl lg:text-3xl font-medium">About</h2>
            {user?.about ? (
              <p className="text-sm lg:text-base whitespace-pre-line">
                {user.about}
              </p>
            ) : (
              <p className="italic text-gray-500"> Nothing here yet!</p>
            )}
          </div>
          <div className="mt-4">
            <div className="flex">
              <h2 className="text-xl lg:text-3xl font-medium mr-3">
                Experience
              </h2>
              {isUser && (
                <ProfileButton
                  onClick={() => {
                    setEditingExperience(!editingExperience);
                    if (editingExperience) {
                      refreshProfile();
                    }
                  }}
                >
                  {editingExperience ? "Finish Editing" : "Edit"}
                </ProfileButton>
              )}
            </div>
            {editingExperience && (
              <p className="text-xs text-gray-500">
                This is just to give a rough idea of experience and ability,
                mainly either for leaders or to help people find others with
                similar experience.
              </p>
            )}
            {user?.experience ? (
              <ExperienceRecord
                experiences={user.experience}
                editable={editingExperience}
              />
            ) : (
              <p className="italic text-gray-500">Nothing here yet!</p>
            )}
          </div>
          <div className="min-h-[10rem] mt-4">
            <h2 className="text-xl lg:text-3xl font-medium">Attended Events</h2>
            {attendedEvents.length > 0 ? (
              <div className="grid grid-cols-2">
                {attendedEvents.map((event) => (
                  <React.Fragment key={event.id}>
                    <p className="text-sm truncate hover:text-blue-400">
                      <Link to={`../../events/${event.id}/`}>
                        {event.title}
                      </Link>
                    </p>
                    <p className="text-gray-500 text-sm">
                      {dateFormat(event.event_date, "dddd, mmm dS, yyyy")}
                    </p>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="italic text-gray-500"> No events yet!</p>
            )}
          </div>
        </div>
      </div>
    </Loading>
  );
}

interface ProfileUploaderButtonProps {
  refreshProfile: () => void;
}

function ProfileUploaderButton({ refreshProfile }: ProfileUploaderButtonProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState("");

  const onButtonClick = useCallback(() => {
    fileInput?.current?.click();
  }, [fileInput]);

  const onChangeFile = useCallback(
    (event) => {
      setLoading(true);
      setErrorText("");
      event.stopPropagation();
      event.preventDefault();
      const file = event.target.files[0];
      let form = new FormData();
      form.append("file", file);
      api
        .patch("users/profile/", form)
        .then((res) => {
          setLoading(false);
          refreshProfile();
        })
        .catch((err) => {
          const errorText =
            err?.response?.data?.profile_picture ||
            "Unknown error. Refresh and try again!";
          setErrorText(errorText);
          setLoading(false);
        });
    },
    [setLoading, refreshProfile, setErrorText]
  );

  return (
    <>
      <input
        type="file"
        ref={fileInput}
        className="hidden"
        onChange={onChangeFile}
      />
      <ProfileButton onClick={onButtonClick} $loading={loading}>
        Upload profile picture
      </ProfileButton>
      {errorText && (
        <div className="w-32 lg:w-64">
          {errorText && (
            <p className="block text-center text-xs text-red-500 italic">
              {errorText}
            </p>
          )}
        </div>
      )}
    </>
  );
}

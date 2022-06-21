import React, { useEffect, useState } from "react";
import api from "../../api";
import { getName } from "../../methods/user";
import { CommitteeUser } from "../../models";
import Loading from "../Loading";
import ProfilePicture from "../members/ProfilePicture";

export default function CommitteePage() {
  const [loading, setLoading] = useState(true);
  const [committee, setCommittee] = useState<Array<CommitteeUser>>([]);

  useEffect(() => {
    setLoading(true);
    api.get("users/committee/").then(response => {
      setCommittee(response.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="sm:text-3xl text-2xl font-medium m-4 text-gray-900">Meet our Committee</h1>
      <Loading loading={loading}>
        <div className="mx-8">
          {committee.sort(committeeSort).map(user => (
            <div key={user.id} className="container flex flex-wrap mx-auto my-2 p-4 items-center text-gray-600 shadow rounded border">
              <div className="md:w-1/4 w-full  mx-auto text-center">
                <div className="w-3/4 p-4 mb-2 mx-auto">
                  <ProfilePicture user={user} />
                </div>
                <h2 className="text-xl">{getName(user)}</h2>
                <h3>{user.committee_role}</h3>
              </div>
              <p className="md:w-3/4 w-full text-lg">
                {user.committee_bio || "No bio found."}
              </p>
            </div>
          ))}
        </div>
      </Loading>
    </div>
  )
}

function committeeSort(c1: CommitteeUser, c2: CommitteeUser) {
  let order = ['Chair', 'Secretary', 'Treasurer', 'General'];

  let get_index = (c: CommitteeUser) => {
    let index = order.indexOf(c.committee_role || "no_role");
    if (index === -1) {
      return order.length
    } else {
      return index
    }
  }

  return get_index(c1) - get_index(c2)
}
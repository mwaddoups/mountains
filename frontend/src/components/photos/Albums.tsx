import dateFormat from "dateformat";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Album } from "../../models";
import { useAuth } from "../Layout";
import Loading from "../Loading";
import ProfilePicture from "../members/ProfilePicture";

export default function Albums() {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  useEffect(() => {
    api.get("albums/").then((res) => {
      setAlbums(res.data);
      setLoading(false);
    });
  }, [setAlbums]);

  return (
    <Loading loading={loading}>
      {(currentUser?.is_site_admin || currentUser?.is_walk_coordinator) && (
        <Link to="new">
          <button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">
            Create album
          </button>
        </Link>
      )}
      <div>
        {albums
          .sort(
            (a1, a2) =>
              new Date(a2.event_date).getTime() -
              new Date(a1.event_date).getTime()
          )
          .map((album, ix) => (
            <Link to={`${album.id}/`} key={ix}>
              <div className="md:h-40 mb-4 p-4 rounded shadow w-full md:flex items-center justify-between">
                <div>
                  <h2 className="text-2xl">{album.name}</h2>
                  <h3 className="text-xs text-gray-500">
                    {album.event_date
                      ? dateFormat(album.event_date, "dddd, mmmm dS, yyyy")
                      : ""}
                  </h3>
                  <div className="flex mt-2">
                    {album.contributors.map((user) => (
                      <Link to={`/platform/members/${user.id}`} key={user.id}>
                        <div className="mr-1 w-10 h-10">
                          <ProfilePicture user={user} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex overflow-hidden md:ml-auto md:pl-2 mt-2 md:mt-auto">
                  {album.photos.map((photo, jx) => (
                    <div className="rounded p-1 shadow border flex-none mr-2">
                      <img
                        className="h-16 fit-cover"
                        src={photo.photo}
                        key={jx}
                        alt="album preview"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </Loading>
  );
}

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Album } from "../../models";
import Loading from "../Loading";
import ProfilePicture from "../members/ProfilePicture";

export default function Albums() {
  const [albums, setAlbums] = useState<Array<Album>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('albums/').then(res => {
      setAlbums(res.data);
      setLoading(false);
    })

  }, [setAlbums])

  return (
    <Loading loading={loading}>
      <div>
        {albums.map((album, ix) =>(
          <Link to={`${album.id}/`} key={ix}>
            <div className="h-40 mb-4 p-4 rounded shadow w-full flex items-center justify-between">
              <div>
                <h2 className="text-2xl">{album.name}</h2>
                <div className="flex mt-2">
                  {album.contributors.map(user => (
                    <Link to={`/platform/members/${user.id}`}>
                      <div className="mr-1 w-10 h-10"><ProfilePicture user={user} /></div>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="hidden md:flex">
                {album.photos.map((photo, jx) => (
                  <img className="h-20 -ml-6 -ml-12 rounded p-1 opacity-80" src={photo.photo} key={jx} alt="album preview" />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Loading>
  )
}
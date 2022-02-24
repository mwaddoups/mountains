import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { Album } from "../../models";
import Loading from "../Loading";

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
              </div>
              <div className="flex">
                {album.photos.map((photo, jx) => (
                  <img className="h-20 -ml-12 rounded p-1 opacity-80" src={photo.photo} key={jx} alt="album preview" />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Loading>
  )
}
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
            <div className="p-4 rounded shadow">
              <h2>{album.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </Loading>
  )
}
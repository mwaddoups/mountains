import React, { useEffect, useState } from "react";
import api from "../../api";
import { Photo } from "../../models";
import Loading from "../Loading";

export default function LandingPhotos() {
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState<Array<Photo>>([])

  useEffect(() => {
    setLoading(true);
    api.get("photos/recent/").then(response => {
      setPhotos(response.data);
      setLoading(false);
    });
  }, [])

  return (
    <Loading loading={loading}> 
      <div className="flex items-center flex-grow flex-wrap md:flex-wrap">
        {photos.map((photo, ix) => (
          <img 
            className="h-32 object-cover mr-1 rounded shadow border"
            src={photo.photo} key={ix} alt='recent club trip' /> 
        ))}
      </div>
    </Loading>
  )
}
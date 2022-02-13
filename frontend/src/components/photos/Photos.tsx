import React, { useEffect, useState } from "react";
import api from "../../api";
import { Photo } from "../../models";
import Loading from "../Loading";
import PhotoUploader from "./PhotoUploader";

export default function Photos() {
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const [photos, setPhotos] = useState<Array<Photo>>([]);

  useEffect(() => {
    api.get('photos/').then(res => {
      setPhotos(res.data);
      setNeedsRefresh(false);
    })

  }, [needsRefresh, setPhotos])


  return (
    <div>
      <div>
        <PhotoUploader setNeedsRefresh={setNeedsRefresh} />
      </div>
      <Loading loading={needsRefresh}>
        <div className="flex flex-wrap">
          {photos.map(photo => (
            <img 
              className="w-40 p-2 flex-1"
              key={photo.id} src={photo.photo} alt="Trip" />
          ))}
        </div>
      </Loading>
    </div>
  )
}
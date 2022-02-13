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
        <div>
          {photos.map(photo => <p key={photo.id}>{photo.photo}</p>)}
          
        </div>
      </Loading>
    </div>
  )
}
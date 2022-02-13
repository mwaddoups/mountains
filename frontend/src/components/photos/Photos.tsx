import React, { useEffect, useState } from "react";
import api from "../../api";
import { Photo } from "../../models";
import Loading from "../Loading";
import PhotoUploader from "./PhotoUploader";

export default function Photos() {
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const [photos, setPhotos] = useState<Array<Photo>>([]);
  const [highlightedPhoto, setHighlightedPhoto] = useState<number | null>(null);

  useEffect(() => {
    api.get('photos/').then(res => {
      setPhotos(res.data);
      setNeedsRefresh(false);
    })

  }, [needsRefresh, setPhotos])


  return (
    <div>
      <div className="mb-1 lg:mb-2">
        <PhotoUploader setNeedsRefresh={setNeedsRefresh} />
      </div>
      <Loading loading={needsRefresh}>
        <div className="flex flex-wrap rounded shadow p-1">
          {photos.map((photo, ix) => <GalleryPhoto 
            key={photo.id} photo={photo} 
            onClick={() => setHighlightedPhoto(ix)} />)}
        </div>
      </Loading>
      {(highlightedPhoto !== null) && (
        <div 
          onClick={() => setHighlightedPhoto(null)}
          className="fixed inset-0 w-full h-screen bg-black flex justify-center align-center">
          <img 
            className="p-4 rounded w-full object-contain"
            src={photos[highlightedPhoto].photo} alt="Mountains" />
        </div>
      )}
    </div>
  )
}


interface GalleryPhotoProps {
  photo: Photo,
  onClick: any
}

function GalleryPhoto({ photo, onClick }: GalleryPhotoProps) {
  return (
    <img 
      className="w-40 p-2 flex-1"
      onClick={onClick}
      src={photo.photo} alt="Mountains" />
  )
}
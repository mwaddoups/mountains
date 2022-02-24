import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { Album, Photo } from "../../models";
import Loading from "../Loading";
import PhotoUploader from "./PhotoUploader";

export default function Photos() {
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const [album, setAlbum] = useState<Album | null>(null);
  const [highlightedPhoto, setHighlightedPhoto] = useState<number | null>(null);

  const { albumId } = useParams();

  useEffect(() => {
    api.get(`albums/${albumId}/`).then(res => {
      setAlbum(res.data);
      setNeedsRefresh(false);
    })
  }, [needsRefresh, setAlbum, albumId])

  const stepBack = useCallback(() => (highlightedPhoto !== null) && setHighlightedPhoto(Math.max(0, highlightedPhoto - 1)), [highlightedPhoto])
  const stepForward = useCallback(() => (highlightedPhoto !== null) && album && setHighlightedPhoto(Math.min(album?.photos.length - 1, highlightedPhoto + 1)), [highlightedPhoto, album])

  const highlightedRef = useRef<HTMLDivElement>(null);
  useEffect(() => highlightedRef.current?.focus());
  const handleKeys = useCallback(event => {
    if (album && (highlightedPhoto !== null)) {
      if (event.keyCode === 37) {
        // Left
        stepBack()
      } else if (event.keyCode === 39) {
        // Right
        stepForward()
      }
    }

  }, [highlightedPhoto, album, stepBack, stepForward])



  return (
    <div>
      <Loading loading={needsRefresh}>
        <div className="flex items-center mb-3 text-3xl text-gray-500">
          <Link to=".."><ArrowLeft /></Link>
          <h1 className="w-1/2 ml-5 flex-none">{album?.name}</h1>
        </div>
        {album && <PhotoUploader setNeedsRefresh={setNeedsRefresh} albumId={album.id} />}
        <div className="mb-1 lg:mb-2">
        </div>
        <div className="flex flex-wrap rounded shadow p-1">
          {album?.photos.map((photo, ix) => <GalleryPhoto 
            key={photo.id} photo={photo} 
            onClick={() => setHighlightedPhoto(ix)} />)}
        </div>
      </Loading>
      {(highlightedPhoto !== null) && (
        <div 
          ref={highlightedRef}
          tabIndex={-1}
          onClick={() => setHighlightedPhoto(null)}
          onKeyDown={handleKeys}
          className="fixed inset-0 w-full h-screen bg-black flex flex-wrap justify-center align-center">
          <img 
            className="p-4 rounded w-full object-contain"
            src={album?.photos[highlightedPhoto].photo} alt="Mountains" />
          <div className="text-gray-100 hover:text-blue-300 ml-2 text-2xl" onClick={e => {e.stopPropagation(); stepBack();}}><ArrowLeftCircleFill /></div>
          <div className="text-gray-100 hover:text-blue-300 ml-auto mr-2 text-2xl" onClick={e => {e.stopPropagation(); stepForward();}}><ArrowRightCircleFill /></div>
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
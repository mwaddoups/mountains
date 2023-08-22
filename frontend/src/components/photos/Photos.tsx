import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons";
import { Link, useParams } from "react-router-dom";
import api from "../../api";
import { getName } from "../../methods/user";
import { Album, Photo } from "../../models";
import Loading from "../Loading";
import PhotoUploader from "./PhotoUploader";
import StarPhoto from "./StarPhoto";
import { Button } from "../base/Base";

export default function Photos() {
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const [album, setAlbum] = useState<Album | null>(null);
  const [numDisplayedPhotos, setNumDisplayedPhotos] = useState(10)
  const [highlightedPhoto, setHighlightedPhoto] = useState<number | null>(null);

  const { albumId } = useParams();

  useEffect(() => {
    api.get(`albums/${albumId}/`).then(res => {
      setAlbum(res.data);
      setNeedsRefresh(false);
    })
  }, [needsRefresh, setAlbum, albumId])

  const increaseDisplayedPhotos = useCallback(() => setNumDisplayedPhotos(numDisplayedPhotos + 10), [numDisplayedPhotos])

  const stepBack = useCallback(() => (highlightedPhoto !== null) && setHighlightedPhoto(Math.max(0, highlightedPhoto - 1)), [highlightedPhoto])
  const stepForward = useCallback(() => {
    if ((highlightedPhoto !== null) && album) {
      setHighlightedPhoto(Math.min(album?.photos.length - 1, highlightedPhoto + 1))
    }

    if (highlightedPhoto && highlightedPhoto >= numDisplayedPhotos) {
      increaseDisplayedPhotos()
    }
  }, [highlightedPhoto, album, increaseDisplayedPhotos, numDisplayedPhotos])

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
          {album?.photos.slice(0, numDisplayedPhotos).map((photo, ix) => <GalleryPhoto 
            key={photo.id} photo={photo} 
            onClick={() => setHighlightedPhoto(ix)} />)}
        </div>
        {album?.photos && numDisplayedPhotos < album.photos.length && (
          <Button className="w-full text-sm" onClick={increaseDisplayedPhotos}>
            Load more photos ({album.photos.length - numDisplayedPhotos})
          </Button>
        )}
      </Loading>
      {(highlightedPhoto !== null) && (
        <div 
          ref={highlightedRef}
          tabIndex={-1}
          onClick={() => setHighlightedPhoto(null)}
          onKeyDown={handleKeys}
          className="fixed inset-0 w-full h-screen bg-black">
          <div className="flex justify-center align-center items-center w-full h-screen">
            <div className="text-gray-100 hover:text-blue-300 ml-2 text-2xl flex-none" onClick={e => {e.stopPropagation(); stepBack();}}><ArrowLeftCircleFill /></div>
            <div className="p-4 flex-grow">
              <img 
                className="p-4 object-contain mx-auto my-auto"
                src={album?.photos[highlightedPhoto].photo} alt="Mountains" />
            </div>
            <div className="text-gray-100 hover:text-blue-300 mr-2 text-2xl flex-none" onClick={e => {e.stopPropagation(); stepForward();}}><ArrowRightCircleFill /></div>
          </div>
          <div className="ml-1 text-gray-200 font-medium text-xs -mt-5 ml-auto">
            U: {getName(album?.photos[highlightedPhoto].uploader)}
            {album && <StarPhoto photo={album.photos[highlightedPhoto]} />}
          </div>
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
      className="md:w-auto w-32 flex-auto object-cover max-h-40 hover:opacity-50"
      onClick={onClick}
      loading="lazy"
      src={photo.photo} alt="Mountains" />
  )
}
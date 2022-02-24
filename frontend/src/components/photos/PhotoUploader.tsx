import React, { useCallback, useEffect, useRef, useState } from "react";
import { Disc } from "react-bootstrap-icons";
import api from "../../api";

interface PhotoUploaderProps {
  setNeedsRefresh: (a: boolean) => void;
  albumId: number,
}

export default function PhotoUploader({ setNeedsRefresh, albumId }: PhotoUploaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const onButtonClick = useCallback(() => {
    setFileList(null);
    fileInput?.current?.click();
  }, [fileInput])

  const onChangeFile = useCallback(event => {
    event.stopPropagation();
    event.preventDefault();
    const files = event.target.files;
    setFileList(files);
  }, [])

  return (
    <>
      <input type="file" ref={fileInput} className="hidden" onChange={onChangeFile} multiple />
      <button 
        className="w-full rounded-lg bg-blue-400 p-1.5 text-gray-100 text-xs lg:text-sm hover:bg-blue-600"
        onClick={onButtonClick}>Upload Photos</button>
      <div>
        {fileList && Array.from(fileList).map((file, ix) => <SinglePhotoUploader file={file} albumId={albumId} key={ix} />)}
      </div>
    </>
  )
}

interface SinglePhotoUploaderProps {
  file: File,
  albumId: number,
}


function SinglePhotoUploader({ file, albumId }: SinglePhotoUploaderProps) {
  const [finished, setFinished] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let form = new FormData();
    form.append('file', file)
    form.append('album', albumId.toString())
    api.post('photos/', form).then(res => {
      setFinished(true);
    }).catch(err => {
      const errorText = "Error uploading file!"
      setErrorText(errorText);
      setFinished(true);
    })

  }, [file, albumId])

  return (
    <div className="grid grid-cols-2 w-full p-2 ml-10">
      <p className="text-2xs lg:text-xs text-gray-500">{file.name}</p>
      {finished
        ? (errorText 
          ? <p className="text-2xs lg:text-xs text-red-500">{errorText}</p> 
          : <p className="text-2xs lg:text-xs text-green-500">Done!</p>)
        : <p className="text-2xs lg:text-xs text-gray-500">Uploading... <Disc className="animate-spin origin-center inline-block" /></p>
      }
      <p></p>

    </div>
  )

}
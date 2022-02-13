import React, { useCallback, useEffect, useRef, useState } from "react";
import api from "../../api";

interface PhotoUploaderProps {
  setNeedsRefresh: (a: boolean) => void;
}

export default function PhotoUploader({ setNeedsRefresh }: PhotoUploaderProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const onButtonClick = useCallback(() => {
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
      <button onClick={onButtonClick}>Upload Photos</button>
      <div>
        {fileList && Array.from(fileList).map((file, ix) => <SinglePhotoUploader file={file} key={ix} />)}
      </div>
    </>
  )
}

interface SinglePhotoUploaderProps {
  file: File,
}


function SinglePhotoUploader({ file }: SinglePhotoUploaderProps) {
  const [finished, setFinished] = useState(false);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    let form = new FormData();
    form.append('file', file)
    api.post('photos/', form).then(res => {
      setFinished(true);
    }).catch(err => {
      const errorText = "Error uploading file!"
      setErrorText(errorText);
      setFinished(true);
    })

  }, [file])

  return (
    <div className="flex">
      <p>{file.name}</p>
      {finished
        ? (errorText 
          ? <p>{errorText}</p> 
          : <p>Done!</p>)
        : <p>Loading...</p>
      }
      <p></p>

    </div>
  )

}
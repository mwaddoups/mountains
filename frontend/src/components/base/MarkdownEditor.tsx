import { ClipboardEventHandler, useRef, useState } from "react"
import { FormTextArea } from "./Base"
import api from "../../api";
import Loading from "../Loading";

interface MarkdownEditorProps {
  id: string,
  value: string,
  setValue: (a: string) => void
}

export default function MarkdownEditor({id, value, setValue}: MarkdownEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const handlePaste: ClipboardEventHandler = event => {
    for (let item of event.clipboardData.items) {
      if (item.type.indexOf("image") === 0) {
        let image = item.getAsFile();
        if (image === null) {
          return
        }

        const insertPastedText = (pastedText: string) => {
          const textLoc = textAreaRef.current?.selectionStart || 0
          setValue(value.slice(0, textLoc) + pastedText + value.slice(textLoc))
        }
        // Images are uploaded as photos with null album
        setLoadingImage(true)
        let form = new FormData();
        form.append('file', image)
        api.post('photos/', form).then(res => {
          insertPastedText(`![](${res.data.photo})`)
          setLoadingImage(false);
        }).catch(err => {
          insertPastedText("[Error uploading image!]")
          setLoadingImage(false);
        })
      }
    }

  }

  return (
    <Loading loading={loadingImage}>
      <FormTextArea id={id} ref={textAreaRef}
        value={value} onChange={event => setValue(event.target.value)}
        onPaste={handlePaste}
      />
    </Loading>
  )

}
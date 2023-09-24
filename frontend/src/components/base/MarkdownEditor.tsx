import { ClipboardEventHandler, useRef } from "react"
import { FormTextArea } from "./Base"

interface MarkdownEditorProps {
  id: string,
  value: string,
  setValue: (a: string) => void
}

export default function MarkdownEditor({id, value, setValue}: MarkdownEditorProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handlePaste: ClipboardEventHandler = event => {
    for (let item of event.clipboardData.items) {
      if (item.type.indexOf("image") === 0) {
        let image = item.getAsFile();
        if (image === null) {
          return
        }
        let reader = new FileReader();
        reader.onload = event => console.log(event.target?.result)
        reader.readAsDataURL(image);

        const textLoc = textAreaRef.current?.selectionStart || 0
        let pastedText = "image pasted";
        setValue(value.slice(0, textLoc) + pastedText + value.slice(textLoc))
      }
    }

  }

  return (
    <FormTextArea id={id} ref={textAreaRef}
      value={value} onChange={event => setValue(event.target.value)}
      onPaste={handlePaste}
    />
  )

}
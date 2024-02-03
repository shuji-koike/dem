import { useEffect } from "react"

export function useDropFile(callback?: (files: FileList) => void) {
  function onDrop(event: DragEvent) {
    if (event.type === "drop" && event.dataTransfer?.files?.length) {
      callback?.(event.dataTransfer.files)
    }
    event.preventDefault()
  }
  useEffect(() => {
    document.ondrop = document.ondragover = onDrop
    return () => void (document.ondrop = document.ondragover = null)
  }, [document])
}

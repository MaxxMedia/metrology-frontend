"use client"
/** Implements the rich text field component and its related interface behavior. */


import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useFormikContext } from "formik"

type Props = {
  name?: string
  value?: string
  onChange?: (val: string) => void
}

/** Renders the rich text editor interface. */
export default function RichTextEditor({
  name,
  value,
  onChange,
}: Props) {

  // Formik is OPTIONAL
  let formik: any = null
  try {
    formik = useFormikContext<any>()
  } catch {
    formik = null
  }

  const content =
    name && formik
      ? formik.values[name] || ""
      : value || ""

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    immediatelyRender: false, // ✅ fixes SSR issue
    onUpdate({ editor }) {
      const html = editor.getHTML()

      if (name && formik) {
        formik.setFieldValue(name, html)
      }

      if (onChange) {
        onChange(html)
      }
    },
  })

  // Sync external value → editor
  useEffect(() => {
    if (!editor) return

    if (value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "")
    }
  }, [value, editor])

  if (!editor) return null

  return (
    <div className="border rounded-md">
      <EditorContent
        editor={editor}
        className="min-h-[180px] p-3 prose max-w-none"
      />
    </div>
  )
}

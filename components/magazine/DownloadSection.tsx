"use client"
/** Implements the magazine download section component and its related interface behavior. */


import { useState } from "react"
import RegistrationModal from "./RegistrationModal"

type Props = {
  magazineId: number
}

/** Renders the download section interface. */
export default function DownloadSection({ magazineId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition"
      >
        Download PDF
      </button>

      {open && (
        <RegistrationModal
          magazineId={magazineId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

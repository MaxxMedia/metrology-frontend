"use client"

import { useEffect, useState } from "react"
import ContentGateModal from "./content-gate-modal"

interface HomeContentGateProps {
  /** Delay in milliseconds before showing the popup modal. Defaults to 7000 (7 seconds) */
  delayMs?: number
}

export default function HomeContentGate({ delayMs = 7000 }: HomeContentGateProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const hasAccess = localStorage.getItem("premiumAccess") === "true"
      const isDismissed = sessionStorage.getItem("contentGateDismissed") === "true"

      // Do not trigger if already unlocked or dismissed in this session
      if (hasAccess || isDismissed) {
        return
      }

      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delayMs)

      return () => clearTimeout(timer)
    } catch {
      // Safe fallback if storage is restricted
    }
  }, [delayMs])

  const handleSuccess = () => {
    try {
      localStorage.setItem("premiumAccess", "true")
    } catch {}
    setIsOpen(false)
  }

  const handleClose = () => {
    try {
      sessionStorage.setItem("contentGateDismissed", "true")
    } catch {}
    setIsOpen(false)
  }

  return (
    <ContentGateModal
      isOpen={isOpen}
      onClose={handleClose}
      onSuccess={handleSuccess}
      contentTitle="Metrology Industrial Intelligence"
    />
  )
}

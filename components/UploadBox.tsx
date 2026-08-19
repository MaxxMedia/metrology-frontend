"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"

interface UploadBoxProps {
  label: string
  value?: string
  onUpload: (file: File) => Promise<void>
  onClear?: () => void
  accept?: string
  className?: string
  height?: string
  uploadType?: "image" | "document"
}

export default function UploadBox({
  label,
  value,
  onUpload,
  onClear,
  accept = "image/*,application/pdf",
  className = "",
  height = "aspect-video",
  uploadType = "image"
}: UploadBoxProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string>(value || "")
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(value || "")
  }, [value])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type against accept prop.
    // `accept` may contain MIME types ("image/*", "application/pdf"),
    // wildcard MIME categories ("image/*"), or file extensions (".pdf", ".doc", ".docx").
    // The old version only ever compared file.type against the raw accept token,
    // which meant extension-based accept strings like ".pdf,.doc,.docx" could
    // never match a real file (file.type is "application/pdf", not ".pdf"),
    // so every document upload was rejected even when valid.
    if (accept) {
      const acceptedTypes = accept.split(',').map(t => t.trim().toLowerCase())
      const fileName = file.name.toLowerCase()
      const fileType = file.type.toLowerCase()

      const isValidType = acceptedTypes.some(type => {
        if (!type) return false

        // Extension-based check, e.g. ".pdf", ".doc", ".docx"
        if (type.startsWith('.')) {
          return fileName.endsWith(type)
        }

        // Wildcard MIME category, e.g. "image/*"
        if (type.includes('/*')) {
          const category = type.split('/')[0]
          return fileType.startsWith(category + '/')
        }

        // Exact MIME type, e.g. "application/pdf"
        return fileType === type
      })

      if (!isValidType) {
        alert(`Please upload a valid file type: ${accept}`)
        return
      }
    }

    // Size limit: 10MB for documents, 5MB for images
    const maxSize = uploadType === "document" ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`)
      return
    }

    setIsUploading(true)
    setUploadError("")

    try {
      // Upload using the appropriate endpoint
      const url = await uploadFile(file, uploadType)

      // Show preview for images only
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // For documents, show filename as preview
        setPreview(file.name)
      }

      // Call the parent's onUpload with the file
      await onUpload(file)
    } catch (error: any) {
      console.error("Upload error:", error)
      const errorMessage = error.message || "Failed to upload file"
      setUploadError(errorMessage)
      alert(errorMessage)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const uploadFile = async (file: File, type: "image" | "document"): Promise<string> => {
    const formData = new FormData()
    const apiUrl = process.env.NEXT_PUBLIC_API_URL

    if (!apiUrl) {
      throw new Error("API URL is not configured")
    }

    if (type === "document") {
      formData.append("document", file)
      const endpoint = `${apiUrl}/api/upload/document`

      console.log(`📄 Uploading document to: ${endpoint}`)
      console.log(`📄 File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`)

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      console.log(`📄 Response status: ${res.status}`)

      if (!res.ok) {
        // Try to parse error response, but handle HTML responses gracefully
        let errorMessage = `Upload failed with status ${res.status}`
        try {
          const contentType = res.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json()
            errorMessage = errorData.error || errorMessage
          } else {
            // HTML response - just use status
            errorMessage = `Server error (${res.status}). Please try again.`
          }
        } catch (parseError) {
          // If parsing fails, use status
          errorMessage = `Server error (${res.status}). Please try again.`
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      if (!data.documentUrl) {
        throw new Error("No document URL returned from server")
      }
      return data.documentUrl
    } else {
      formData.append("image", file)
      const endpoint = `${apiUrl}/api/upload`

      console.log(`🖼️ Uploading image to: ${endpoint}`)
      console.log(`🖼️ File: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`)

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      console.log(`🖼️ Response status: ${res.status}`)

      if (!res.ok) {
        let errorMessage = `Upload failed with status ${res.status}`
        try {
          const contentType = res.headers.get('content-type')
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json()
            errorMessage = errorData.error || errorMessage
          } else {
            errorMessage = `Server error (${res.status}). Please try again.`
          }
        } catch (parseError) {
          errorMessage = `Server error (${res.status}). Please try again.`
        }
        throw new Error(errorMessage)
      }

      const data = await res.json()
      if (!data.imageUrl) {
        throw new Error("No image URL returned from server")
      }
      return data.imageUrl
    }
  }

  const handleRemove = () => {
    setPreview("")
    onClear?.()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const isImagePreview =
    preview &&
    (preview.startsWith("data:image") ||
      preview.startsWith("http") ||
      preview.match(/\.(jpeg|jpg|png|webp|gif)$/i))

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative group">
          {isImagePreview ? (
            <div className={`relative w-full ${height} rounded-xl border border-[#292C30] overflow-hidden bg-[#171A1E]`}>
              <Image
                src={preview}
                alt="Upload preview"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-[#171A1E] rounded-xl border border-[#292C30] min-h-[60px]">
              <span className="text-sm text-[#CCCCCC] truncate flex-1">
                {preview}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-md"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center w-full ${height} border-2 border-dashed border-[#292C30] rounded-xl hover:border-[#00B5ED] transition-colors cursor-pointer bg-[#171A1E] hover:bg-[#22272c]`}
        >
          <Upload className="w-8 h-8 text-[#B8B8B8] mb-2" />
          <p className="text-sm text-[#CCCCCC] text-center px-4 font-medium">
            {label}
          </p>
          {uploadError && (
            <p className="text-xs text-rose-400 mt-1">{uploadError}</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="absolute inset-0 bg-[#171A1E]/90 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="text-sm text-[#00B5ED] font-medium">Uploading...</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
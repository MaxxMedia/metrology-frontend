// components/comments-section.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

type Comment = {
  id: number
  content: string
  createdAt: string
  updatedAt: string
  user: {
    id: number
    fullName: string
    username: string
    avatarUrl?: string
  }
}

interface CommentsSectionProps {
  postId: number
  initialComments: Comment[]
  isLoggedIn: boolean
  token: string | null
  onCommentAdded?: (newComment: Comment) => void
}

function timeAgo(date: string) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  )

  if (seconds < 60) return "Just now"

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60)
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`

  const days = Math.floor(hours / 24)
  if (days < 7)
    return `${days} day${days > 1 ? "s" : ""} ago`

  return new Date(date).toLocaleDateString()
}

export function CommentsSection({
  postId,
  initialComments,
  isLoggedIn,
  token,
  onCommentAdded,
}: CommentsSectionProps) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [comment, setComment] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [website, setWebsite] = useState("")
  const [saveDetails, setSaveDetails] = useState(false)
  const [postingComment, setPostingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  const submitComment = async () => {
    if (!comment.trim()) {
      setCommentError("Please enter a comment")
      return
    }

    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    setCommentError(null)
    setPostingComment(true)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: comment.trim(),
          }),
        }
      )

      let responseData
      const responseText = await response.text()
      
      try {
        responseData = JSON.parse(responseText)
      } catch (e) {
        responseData = { message: responseText }
      }

      if (!response.ok) {
        const errorMessage = responseData?.error || responseData?.message || `Server error: ${response.status}`
        throw new Error(errorMessage)
      }

      const newComment = responseData
      setComments((prev) => [newComment, ...prev])
      setComment("")
      setCommentError(null)
      
      if (onCommentAdded) {
        onCommentAdded(newComment)
      }
    } catch (err) {
      console.error("❌ Comment submission error:", err)
      const errorMessage = err instanceof Error ? err.message : "Failed to post comment"
      setCommentError(errorMessage)
      
      if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized")) {
        router.push("/login")
      } else {
        alert(`Failed to post comment: ${errorMessage}`)
      }
    } finally {
      setPostingComment(false)
    }
  }

  return (
    <div className="mt-12 rounded-lg bg-[#1d2125] px-6 py-10 sm:px-10 sm:py-12 lg:p-[50px]">
      <h3 className="text-2xl font-bold text-white">
        Leave a Comment
      </h3>
      <p className="mt-4 text-base text-gray-300">
        Your email address will not be published. Required fields are marked *
      </p>

      {/* Comment Input */}
      <div className="mt-9">
        <div className="grid gap-8 sm:grid-cols-2">
          <label className="border-b border-white/10 pb-4 text-base text-gray-300">
            <span>Full Name *</span>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="mt-2 block w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              disabled={!isLoggedIn || postingComment}
            />
          </label>
          <label className="border-b border-white/10 pb-4 text-base text-gray-300">
            <span>Email *</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="mt-2 block w-full bg-transparent text-white outline-none placeholder:text-gray-500"
              disabled={!isLoggedIn || postingComment}
            />
          </label>
        </div>

        <label className="mt-8 block border-b border-white/10 pb-4 text-base text-gray-300">
          <span>Website</span>
          <input
            type="url"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="url"
            className="mt-2 block w-full bg-transparent text-white outline-none placeholder:text-gray-500"
            disabled={!isLoggedIn || postingComment}
          />
        </label>

        <label className="mt-8 block text-base text-gray-300">
          <span>Write Comment</span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={isLoggedIn ? "" : "Please login to comment"}
            className="mt-3 block min-h-[128px] w-full resize-y border-b border-white/10 bg-transparent py-2 text-white outline-none placeholder:text-gray-500"
            disabled={!isLoggedIn || postingComment}
          />
        </label>

        <label className="mt-6 flex items-center gap-3 text-base text-gray-300">
          <input
            type="checkbox"
            checked={saveDetails}
            onChange={(e) => setSaveDetails(e.target.checked)}
            className="h-5 w-5 accent-[#0073ff]"
            disabled={!isLoggedIn || postingComment}
          />
          <span>Save my name, email, and website in this browser for the next time I comment.</span>
        </label>

        {commentError && (
          <p className="mt-4 text-sm text-red-400">{commentError}</p>
        )}
        <button
          onClick={submitComment}
          disabled={!comment.trim() || postingComment || !isLoggedIn}
          className="mt-8 rounded-md bg-[#0073ff] px-9 py-4 text-base font-semibold text-white transition-colors hover:bg-[#0066e6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {postingComment ? "Posting..." : "Post Comment"}
        </button>
        {!isLoggedIn && (
          <p className="mt-3 text-sm text-gray-400">
            <button
              onClick={() => router.push("/login")}
              className="font-medium text-[#38bdf8] hover:underline"
            >
              Login
            </button>{" "}
            to join the conversation
          </p>
        )}
      </div>

      {/* Comments List
      <div className="mt-10 space-y-6">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#15191d] py-10 text-center">
            <MessageCircle
              size={42}
              className="mx-auto text-gray-400 mb-3"
            />
            <h3 className="text-lg font-semibold text-white">
              No comments yet
            </h3>
            <p className="mt-2 text-gray-400">
              Start the discussion by posting the first comment.
            </p>
          </div>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-white/10 bg-[#15191d] p-5 shadow-sm"
            >
              <UserAvatar
                name={item.user.fullName}
                imageUrl={item.user.avatarUrl}
                size="md"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-white">
                    {item.user.fullName}
                  </h4>
                  <span className="text-xs text-gray-400">
                    @{item.user.username}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-400">
                  {timeAgo(item.createdAt)}
                </p>

                <p className="mt-3 leading-7 text-gray-300 whitespace-pre-wrap break-words">
                  {item.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div> */}
    </div>
  )
}
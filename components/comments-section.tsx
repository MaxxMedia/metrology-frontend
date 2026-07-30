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

  const commentCount = comments.length

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-[#003049] mb-6">
        Comments ({commentCount})
      </h3>

      {/* Comment Input */}
      <div className="mb-8">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={isLoggedIn ? "Write a comment..." : "Please login to comment"}
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003B5C] focus:border-transparent resize-y min-h-[100px]"
          disabled={!isLoggedIn || postingComment}
        />
        {commentError && (
          <p className="text-red-500 text-sm mt-2">{commentError}</p>
        )}
        <button
          onClick={submitComment}
          disabled={!comment.trim() || postingComment || !isLoggedIn}
          className="mt-3 bg-[#003B5C] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#002d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {postingComment ? "Posting..." : "Post Comment"}
        </button>
        {!isLoggedIn && (
          <p className="text-sm text-gray-500 mt-2">
            <button
              onClick={() => router.push("/login")}
              className="text-[#003B5C] hover:underline font-medium"
            >
              Login
            </button>{" "}
            to join the conversation
          </p>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-10 border rounded-xl bg-gray-50">
            <MessageCircle
              size={42}
              className="mx-auto text-gray-400 mb-3"
            />
            <h3 className="font-semibold text-lg">
              No comments yet
            </h3>
            <p className="text-gray-500 mt-2">
              Start the discussion by posting the first comment.
            </p>
          </div>
        ) : (
          comments.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <UserAvatar
                name={item.user.fullName}
                imageUrl={item.user.avatarUrl}
                size="md"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900">
                    {item.user.fullName}
                  </h4>
                  <span className="text-xs text-gray-500">
                    @{item.user.username}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  {timeAgo(item.createdAt)}
                </p>

                <p className="mt-3 text-gray-700 leading-7 whitespace-pre-wrap break-words">
                  {item.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
// components/user-avatar.tsx
"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, getAvatarColor } from "@/lib/utils"

interface UserAvatarProps {
  name: string
  imageUrl?: string | null
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
  onClick?: () => void
}

const sizeMap = {
  xs: "size-6 text-[8px]",
  sm: "size-8 text-[10px]",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
}

export function UserAvatar({
  name,
  imageUrl,
  size = "md",
  className = "",
  onClick,
}: UserAvatarProps) {
  const initials = getInitials(name)
  const colorClass = getAvatarColor(name)

  return (
    <Avatar
      className={`${sizeMap[size]} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <AvatarImage
        src={imageUrl || undefined}
        alt={name}
      />
      <AvatarFallback className={`${colorClass} text-white font-semibold`}>
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
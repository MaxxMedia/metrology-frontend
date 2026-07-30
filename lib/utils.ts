// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate initials from a full name
 * Example: "Rohan Mondal" -> "RM"
 *          "John Doe" -> "JD"
 *          "Jane" -> "JA" (if only one name)
 *          "Mary Jane Smith" -> "MS" (first and last)
 */
export function getInitials(name: string): string {
  if (!name || name.trim() === "") return "??"
  
  const parts = name.trim().split(/\s+/)
  
  if (parts.length === 1) {
    // Single name - take first two characters
    return parts[0].substring(0, 2).toUpperCase()
  }
  
  // Take first letter of first name and first letter of last name
  const firstName = parts[0]
  const lastName = parts[parts.length - 1]
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}

/**
 * Generate a consistent color based on name for avatar fallback
 * This ensures the same user always gets the same color
 */
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-lime-500",
    "bg-emerald-500",
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Truncate text to a specified length
 */
export function truncateText(text: string, length: number = 100): string {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
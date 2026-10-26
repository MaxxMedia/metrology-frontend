/** Shared data contracts for admin company, recruiter, directory, and moderation views. */
/** Represents a company record shown in admin tools, including its verification state and creation time. */
export type Company = {
  id: number
  name: string
  slug: string
  isVerified: boolean
  createdAt: string
}

/** Represents a recruiter account and its optional company association. */
export type Recruiter = {
  id: number
  username: string
  email: string
  createdAt: string
  company?: {
    name: string
  }
}

/** Represents a submitted directory listing; status tracks whether admin review is pending, approved, or rejected. */
export type Directory = {
  id: number
  name: string
  slug: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  createdAt: string

  company?: {
    name: string
  }

  submittedBy?: {
    username: string
  }
}


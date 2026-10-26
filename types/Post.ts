/** Shared article and post data contracts, including authors, categories, and company attribution. */
/** Author metadata attached to published content; profile fields may be absent or explicitly null. */
export type Author = {
  id: number
  name: string
  bio?: string | null
  avatarUrl?: string | null
}

/** A category or subcategory record used to classify a post. */
export type Category = {
  id: number
  name: string
  slug: string
}

/** A published post model. Optional and nullable fields reflect content that may be missing from API responses; author, category, and company hold related records. */
export type Post = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  badge?: string | null
  content: string

  imageUrl?: string | null
  youtubeUrl?: string | null   
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null

  views?: number | null

  author?: Author
  category?: Category
  subCategory?: Category
  Company?: {
    id: number
    name: string
    slug?: string
    logoUrl?: string | null
  }
}
/** Supplier and company data contract used by supplier directory and profile views. */
/** Represents a supplier listing, its contact and media fields, social links, and optional company details. */
export type Supplier = {
  id: number
  companyId: number
  name: string
  slug: string
  description: string
  website?: string
  logoUrl?: string
  coverImageUrl?: string
  phoneNumber?: string
  email?: string
  tradeNames?: string[]
  videoGallery?: string[]
  socialLinks?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    youtube?: string
  }
  company?: {
    id: number
    name: string
    location?: string
    industry?: string
    website?: string
  }
}
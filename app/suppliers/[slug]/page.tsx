// app/supplier/[slug]/page.tsx
import CompanyArticlesCarousel from "@/components/CompanyArticlesCarousel"
import SocialLinksTracker from "@/components/SocialLinksTracker"
import QuoteRequestButton from "@/components/QuteRequestForm"
import {
  LucideFacebook,
  LucideLinkedin,
  LucideTwitter,
  LucideYoutube,
  Globe,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import ClaimCompanyBanner from "@/components/ClaimCompanyBanner"
import GalleryTabs from "@/components/GalleryTabs"
import GalleryGridWithLightbox from "@/components/GalleryGridWithLightbox"
import {
  BrandsAndIndustries,
  ProductSuppliesSection,
  CertificationsSection,
} from "@/components/SupplierExtraDetails"
import SupplierPromotionBanner from "@/components/SupplierPromotionBanner"
import Link from "next/link"
import { cookies } from "next/headers"
export const dynamic = "force-dynamic"
export const revalidate = 0

type JwtPayload = {
  id: number
  role: string
  email: string
  companyId?: number | null
}

async function getCurrentUser(): Promise<JwtPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

  console.log("[getCurrentUser] token present?", Boolean(token))

  if (!token) return null

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })

    console.log("[getCurrentUser] /me status:", res.status)

    if (!res.ok) {
      const errBody = await res.text()
      console.log("[getCurrentUser] /me error body:", errBody)
      return null
    }

    if (!res.ok) return null
    const data = await res.json()
    return data as JwtPayload
    // return data.user as JwtPayload
  } catch (err) {
    console.log("[getCurrentUser] fetch threw:", err)
    return null
  }
}
type Article = {
  id: number
  title: string
  slug: string
  excerpt?: string | null
  imageUrl?: string | null
  publishedAt: string
}

type GalleryItem = {
  image: string
  name?: string
  description?: string
}

type Supplier = {
  productCatalogues?: string[]
  planTier?: "free" | "basic" | "professional" | "enterprise" | string | null
  promotionBanners?: string[]
  googleMapUrl?: string | null
  id: number
  companyId: number
  name: string
  slug: string
  description: string
  website?: string
  logoUrl?: string
  coverImageUrl?: string | string[] | null
  phoneNumber?: string
  email?: string
  tradeNames?: string[]
  videoGallery?: string[]
  productGallery?: GalleryItem[] | string[]
  companyGallery?: GalleryItem[] | string[]
  factoryGallery?: GalleryItem[] | string[]
  enableInquiryForm?: boolean
  views?: number
  connections?: number
  createdAt?: string
  socialLinks?: {
    facebook?: string
    linkedin?: string
    twitter?: string
    youtube?: string
    whatsapp?: string
  }
  companyBrochure?: string[]
  certifications?: string[]
  brandsRepresented?: string[]
  industriesServed?: string[]
  exportMarkets?: string[]
  manufacturingCapabilities?: string | null
  manufacturingCapabilityImages?: string[]
  manufacturingCapabilityVideos?: string[]
  machineryList?: string | null
  machineryImages?: string[]
  qualityStandards?: string | null
  productSupplies?: string[]
  Company?: {
    id: number
    name: string
    location?: string
    industry?: string
    website?: string
    tagline?: string
    slug?: string
  }
}

function getGalleryImage(item: any): string {
  if (typeof item === 'string') return item
  return item?.image || ''
}

function getGalleryName(item: any): string {
  if (typeof item === 'string') return ''
  return item?.name || ''
}

function getGalleryDescription(item: any): string {
  if (typeof item === 'string') return ''
  return item?.description || ''
}

function GalleryItemCard({ item, title }: { item: any; title?: string }) {
  const image = getGalleryImage(item)
  const name = getGalleryName(item)
  const description = getGalleryDescription(item)

  return (
    <div className="bg-[#1D2125] rounded-lg overflow-hidden shadow-md border border-[#292C30]">
      <div className="aspect-square overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name || title || 'Gallery image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#171A1E] flex items-center justify-center text-gray-500">
            No image
          </div>
        )}
      </div>
      {(name || description) && (
        <div className="p-4">
          {name && <h4 className="text-[20px] font-medium text-white">{name}</h4>}
          {description && <p className="text-[15px] text-gray-400 mt-1">{description}</p>}
        </div>
      )}
    </div>
  )
}

function GalleryGrid({ items, title }: { items: any[]; title?: string }) {
  if (!items || items.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.filter(item => {
        if (typeof item === 'string') return item.trim().length > 0
        return item && item.image && item.image.trim().length > 0
      }).map((item, index) => (
        <GalleryItemCard key={index} item={item} title={title} />
      ))}
    </div>
  )
}

export default async function SupplierShowroomPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supplierRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${slug}`,
    { cache: "no-store" }
  )

  if (!supplierRes.ok) {
    return (
      <div className="min-h-screen bg-[#0a0d14] p-10 text-center text-[16px] text-gray-400">
        Supplier not found
      </div>
    )
  }

  const supplier: Supplier = await supplierRes.json()

  const social = supplier.socialLinks || {}

  const articlesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/companies/${supplier.companyId}/articles`,
    { cache: "no-store" }
  )

  let articles: Article[] = []
  if (articlesRes.ok) {
    articles = await articlesRes.json()
  }

  const websiteLink = supplier.website || supplier.Company?.website

  const rawPlanTier = supplier.planTier
  const normalizedPlanTier = (
    String(rawPlanTier ?? "free").trim().toLowerCase()
  ) as "free" | "basic" | "professional" | "enterprise"

  const KNOWN_TIERS = ["free", "basic", "professional", "enterprise"]
  const isPaid =
    KNOWN_TIERS.includes(normalizedPlanTier) && normalizedPlanTier !== "free"

  const showQuoteButton = isPaid && supplier.enableInquiryForm !== false

  const currentUser = await getCurrentUser()
  const isLoggedIn = Boolean(currentUser)
  const isOwner =
    isLoggedIn && currentUser?.companyId === supplier.companyId

  const showUpsellToOwner = !isPaid && isOwner

  const companySlug = supplier.Company?.slug || supplier.slug

  // Some components may not have proper TS prop typings; cast to any to avoid IntrinsicAttributes errors
  const GalleryTabsAny: any = GalleryTabs

  const location = supplier.Company?.location || ""

  function getMapEmbedUrl(googleMapUrl?: string | null, location?: string): string | null {
    if (googleMapUrl) {
      const coordMatch = googleMapUrl.match(/@([-0-9.]+),([-0-9.]+)/)
      if (coordMatch) {
        const lat = coordMatch[1]
        const lng = coordMatch[2]
        return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`
      }

      const queryMatch = googleMapUrl.match(/[?&]q=([^&]+)/)
      if (queryMatch) {
        const query = decodeURIComponent(queryMatch[1])
        return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
      }

      const placeMatch = googleMapUrl.match(/\/place\/([^/]+)/)
      if (placeMatch) {
        const place = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
        return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&z=15&output=embed`
      }

      if (googleMapUrl.includes('google.com/maps')) {
        if (googleMapUrl.includes('output=embed')) {
          return googleMapUrl
        }
        if (googleMapUrl.includes('?q=')) {
          const match = googleMapUrl.match(/[?&]q=([^&]+)/)
          if (match) {
            const query = decodeURIComponent(match[1])
            return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
          }
        }
      }
    }

    if (location) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(location)}&z=15&output=embed`
    }

    return null
  }

  const mapEmbedUrl = getMapEmbedUrl(supplier.googleMapUrl, location)
  const hasValidMap = mapEmbedUrl !== null

  const bannerLimit = normalizedPlanTier === "basic"
    ? 1
    : normalizedPlanTier === "professional"
      ? 3
      : normalizedPlanTier === "enterprise"
        ? 5
        : 0;

  const bannerImages = (
    Array.isArray(supplier.coverImageUrl)
      ? supplier.coverImageUrl
      : supplier.coverImageUrl
        ? [supplier.coverImageUrl]
        : []
  );

  const limitedBannerImages = bannerImages.slice(0, bannerLimit);


  return (
    <div className="min-h-screen bg-[#0a0d14]">
      <div className="relative bg-[#0a0d14] h-[140px] sm:h-[170px] md:h-[200px]" />

      {isPaid && limitedBannerImages.length > 0 && (
        <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-10 md:-mt-14">
          <SupplierPromotionBanner
            planTier={normalizedPlanTier}
            companyId={supplier.Company?.id}
            isLoggedIn={isLoggedIn}
            isCandidate={currentUser?.role === "candidate"}
            name={supplier.name}
            location={supplier.Company?.location}
            logoUrl={supplier.logoUrl}
            tagline={supplier.Company?.tagline}
            tradeNames={supplier.tradeNames}
            phoneNumber={supplier.phoneNumber}
            email={supplier.email}
            website={websiteLink}
            socialLinks={supplier.socialLinks}
            slug={supplier.slug}
            showQuoteButton={showQuoteButton}
            coverImageUrl={limitedBannerImages}
          />
        </div>
      )}

      <div
        className={`relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-16 ${isPaid ? "mt-6" : "-mt-16 sm:-mt-20 md:-mt-24"
          }`}
      >
        {!isPaid && (
          <div className="bg-[#1D2125] rounded-xl shadow-lg p-6 sm:p-10 border border-[#292C30] border-t-4 border-t-[#0073FF]">
            <h1 className="text-[24px] font-bold text-center text-white">
              {supplier.name}
            </h1>

            {location && (
              <p className="flex items-center justify-center gap-2 text-[12px] text-gray-400 mt-2">
                <MapPin size={16} />
                {location}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-14 mt-8 md:mt-12">
              <aside className="space-y-6 md:space-y-8 md:col-span-1">
                {supplier.logoUrl && (
                  <img
                    src={supplier.logoUrl}
                    alt={supplier.name}
                    className="w-full max-w-[160px] object-contain"
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div className="text-[12px] space-y-3 text-[#CCCCCC]">
                    {supplier.tradeNames && supplier.tradeNames.length > 0 && (
                      <p className="text-gray-400">
                        <strong className="text-[#CCCCCC]">Trade Names:</strong>{" "}
                        {supplier.tradeNames.join(", ")}
                      </p>
                    )}

                    {supplier.phoneNumber && (
                      <p className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        {supplier.phoneNumber}
                      </p>
                    )}

                    {supplier.email && (
                      <p className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        {supplier.email}
                      </p>
                    )}

                    {websiteLink && (
                      <p className="flex items-center gap-2">
                        <Globe size={14} className="text-gray-500" />
                        <a
                          href={websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00B5ED] hover:underline"
                        >
                          {websiteLink}
                        </a>
                      </p>
                    )}
                  </div>

                  {showQuoteButton && (
                    <div className="shrink-0">
                      <QuoteRequestButton
                        supplierSlug={supplier.slug}
                        supplierName={supplier.name}
                      />
                    </div>
                  )}
                </div>

                {(social.facebook ||
                  social.linkedin ||
                  social.twitter ||
                  social.youtube) && (
                    <div>
                      <h4 className="text-[12px] font-semibold text-gray-400 uppercase mb-3">
                        Connect
                      </h4>

                      <SocialLinksTracker supplierId={supplier.id}>
                        <div className="flex gap-4">
                          {social.facebook && (
                            <a href={social.facebook} target="_blank">
                              <LucideFacebook className="w-5 h-5 text-[#3b5998]" />
                            </a>
                          )}
                          {social.linkedin && (
                            <a href={social.linkedin} target="_blank">
                              <LucideLinkedin className="w-5 h-5 text-[#0077b5]" />
                            </a>
                          )}
                          {social.twitter && (
                            <a href={social.twitter} target="_blank">
                              <LucideTwitter className="w-5 h-5" />
                            </a>
                          )}
                          {social.youtube && (
                            <a href={social.youtube} target="_blank">
                              <LucideYoutube className="w-5 h-5 text-red-600" />
                            </a>
                          )}
                        </div>
                      </SocialLinksTracker>
                    </div>
                  )}
              </aside>

              <section className="md:col-span-2">
                <div
                  className="post-article-content prose prose-invert max-w-none text-[16px] text-gray-300 prose-headings:!text-white prose-p:!text-gray-300 prose-strong:!text-white prose-a:!text-[#00B5ED] [&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-gray-300"
                  dangerouslySetInnerHTML={{ __html: supplier.description }}
                />
              </section>
            </div>

            {!isPaid && (
              <>
                {(supplier.productGallery && (supplier.productGallery as any[]).filter(item => {
                  if (typeof item === 'string') return item.trim().length > 0
                  return item && item.image && item.image.trim().length > 0
                }).length > 0) && (
                    <div className="mt-8">
                      <h3 className="text-[20px] font-semibold text-white mb-4">Product Gallery</h3>
                      <GalleryGrid items={supplier.productGallery as any[]} title="Product" />
                    </div>
                  )}

                {(supplier.companyGallery && (supplier.companyGallery as any[]).filter(item => {
                  if (typeof item === 'string') return item.trim().length > 0
                  return item && item.image && item.image.trim().length > 0
                }).length > 0) && (
                    <div className="mt-8">

                      <h3 className="text-[20px] font-semibold text-white mb-4">Company Gallery</h3>

                      <GalleryGridWithLightbox items={supplier.companyGallery as any[]} title="Company" />

                    </div>
                  )}

                {(supplier.factoryGallery && (supplier.factoryGallery as any[]).filter(item => {
                  if (typeof item === 'string') return item.trim().length > 0
                  return item && item.image && item.image.trim().length > 0
                }).length > 0) && (
                    <div className="mt-8">
                      <h3 className="text-[20px] font-semibold text-white mb-4">Factory Gallery</h3>

                      <GalleryGridWithLightbox items={supplier.factoryGallery as any[]} title="Factory" />
                    </div>
                  )}
              </>
            )}
          </div>
        )}


        {/* NEW — Brands/Industries card and Location Map card, same row */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <BrandsAndIndustries
            brandsRepresented={supplier.brandsRepresented}
            industriesServed={supplier.industriesServed}
            exportMarkets={supplier.exportMarkets}
          />

          {hasValidMap ? (
            <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6 h-full">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Location Map
              </h4>
              <div className="rounded-lg overflow-hidden border border-[#292C30] h-[300px] relative">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Supplier Location"
                  className="w-full h-full"
                />
              </div>

              {location && (
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <MapPin size={12} />
                  {location}
                </p>
              )}
              <a
                href={supplier.googleMapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[#00B5ED] hover:underline text-sm"
              >
                Open in Google Maps →
              </a>
            </div>
          ) : location ? (
            <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg p-6 h-full">
              <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
                <MapPin size={16} />
                Location
              </h4>
              <p className="text-[#CCCCCC]">{location}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-[#00B5ED] hover:underline text-sm"
              >
                View on Google Maps →
              </a>
            </div>
          ) : null}
        </div>

        {/* NEW — after the map */}
        <ProductSuppliesSection productSupplies={supplier.productSupplies} />

        {showUpsellToOwner && <ClaimCompanyBanner />}

        <hr className="my-10 md:my-12 border-[#292C30]" />

        {showUpsellToOwner && (
          <div className="text-center py-8 px-6 mb-8 bg-[#1D2125] border border-dashed border-[#292C30] rounded-xl">
            <p className="text-[20px] text-[#CCCCCC] font-semibold">
              Want to upload your own photos and videos?
            </p>
            <p className="text-[15px] text-gray-400 mt-1">
              Upgrade your plan to add and manage your own gallery content.
            </p>
            <Link
              href="/login"
              className="inline-block mt-4 bg-[#0073FF] text-white px-6 py-2 text-[15px] font-semibold uppercase hover:bg-[#0060D0] transition rounded-lg"
            >
              Purchase a Plan
            </Link>
          </div>
        )}

        <GalleryTabsAny
          videoGallery={supplier.videoGallery}
          productGallery={supplier.productGallery}
          companyGallery={supplier.companyGallery}
          factoryGallery={supplier.factoryGallery}
          productCatalogues={supplier.productCatalogues}
          isPaid={isPaid}
          companySlug={companySlug}
          companyBrochure={supplier.companyBrochure}
          manufacturingCapabilities={supplier.manufacturingCapabilities}
          manufacturingCapabilityImages={supplier.manufacturingCapabilityImages}
          manufacturingCapabilityVideos={supplier.manufacturingCapabilityVideos}
          machineryList={supplier.machineryList}
          machineryImages={supplier.machineryImages}
          qualityStandards={supplier.qualityStandards}
        />

        {articles.length > 0 && (
          <>
            <hr className="my-10 md:my-12 border-[#292C30]" />
            <CompanyArticlesCarousel articles={articles} />
          </>
        )}

        {/* NEW — very bottom of the page */}
        <CertificationsSection certifications={supplier.certifications} />
      </div>
    </div>
  )
}
"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import Link from "next/link"
import type { ContentLimitEligibility } from "@/lib/packageLimits"
import { countFilledProducts } from "@/lib/productListings"

const PackageLimitModal = dynamic(
  () => import("@/components/recruiter/PackageLimitModal"),
  { ssr: false }
)

type Directory = {
  id: number
  name: string
  slug: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  isLiveEditable: boolean
  createdAt: string

  logoUrl?: string
  coverImageUrl?: string

  productSupplies?: unknown

  videoGallery?: unknown
  productGallery?: unknown
  companyGallery?: unknown
  factoryGallery?: unknown
  productCatalogues?: unknown  // ✅ This is correct

  companyBrochure?: unknown
  certifications?: unknown

  brandsRepresented?: unknown
  industriesServed?: unknown
  exportMarkets?: unknown

  manufacturingCapabilities?: unknown
  machineryList?: unknown
  qualityStandards?: unknown

  enableInquiryForm?: boolean
}

export default function RecruiterDirectoriesPage() {
  const [directories, setDirectories] = useState<Directory[]>([])
  const [listingEligibility, setListingEligibility] =
    useState<ContentLimitEligibility | null>(null)
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          if (!cancelled) setError("Please log in again.")
          return
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        if (!apiUrl) {
          if (!cancelled) setError("API URL is not configured.")
          return
        }

        const directoriesRes = await fetch(
          `${apiUrl}/api/suppliers/recruiter/directories`,
          {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }
        )

        if (!directoriesRes.ok) {
          const error = await directoriesRes.json().catch(() => ({}))
          setError(
            error.error ??
            "The server is temporarily unavailable. Please try again later."
          )
          return
        }

        const data = await directoriesRes.json()
        if (!cancelled) {
          setDirectories(Array.isArray(data) ? data : [])
        }

        try {
          const eligibilityRes = await fetch(
            `${apiUrl}/api/suppliers/recruiter/product-listings/eligibility`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          )
          if (eligibilityRes.ok && !cancelled) {
            setListingEligibility(await eligibilityRes.json())
          }
        } catch (eligibilityError) {
          console.error("Eligibility load error:", eligibilityError)
        }
      } catch (err: unknown) {
        console.error("LOAD ERROR:", err)
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load directories"
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadData()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#00B5ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#CCCCCC]">Loading directories…</p>
        </div>
      </div>
    )
  }

  const canCreateDirectory = directories.length === 0

  return (
    <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-[#FFFFFF]">My Directories</h1>

          {canCreateDirectory && (
            <Link
              href="/recruiter/directory/new"
              onClick={(e) => {
                if (listingEligibility && !listingEligibility.canAdd) {
                  e.preventDefault()
                  setShowLimitModal(true)
                }
              }}
              className="bg-[#0073FF] hover:bg-[#0060D0] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              + Add Directory
            </Link>
          )}
        </div>

        <p className="text-sm text-[#B8B8B8] mb-6">
          {directories.length} supplier {directories.length === 1 ? "directory" : "directories"}
          {directories.length > 0 && " · One directory allowed per account"}
          {listingEligibility && !listingEligibility.isUnlimited && (
            <>
              {" · "}
              {listingEligibility.activeListings ?? directories.length} of{" "}
              {listingEligibility.effectiveLimit ?? 0} directory slots used
              {" · "}
              {listingEligibility.remaining ?? 0} remaining on your{" "}
              {listingEligibility.planLabel ?? "plan"}
            </>
          )}
          {listingEligibility?.isUnlimited && " · Unlimited supplier directories on your plan"}
        </p>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
            {error}
          </div>
        )}

        <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-sm divide-y divide-[#292C30]">
          {directories.length === 0 && !error && (
            <div className="p-8 text-center text-[#CCCCCC]">
              <p>You haven&apos;t created any directories yet.</p>
              <Link
                href="/recruiter/directory/new"
                className="mt-3 inline-block text-[#00B5ED] hover:underline font-medium"
              >
                Create your supplier directory →
              </Link>
            </div>
          )}

          {directories.map((dir) => {
            const productCount = countFilledProducts(dir.productSupplies)
            const isPublic = dir.status === "APPROVED"
            return (
              <div
                key={dir.id}
                className="p-5 flex items-center justify-between gap-4 hover:bg-[#22272c] transition-colors"
              >
                {isPublic ? (
                  <Link
                    href={`/suppliers/${dir.slug}`}
                    className="flex-1 min-w-0 group"
                  >
                    <h3 className="font-semibold text-[#FFFFFF] group-hover:text-[#00B5ED] transition-colors text-base">
                      {dir.name}
                    </h3>
                    <p className="text-sm text-[#B8B8B8] mt-1">
                      /suppliers/{dir.slug}
                      {" · "}
                      {productCount} product{productCount === 1 ? "" : "s"} listed
                    </p>
                  </Link>
                ) : (
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#FFFFFF] text-base">{dir.name}</h3>
                    <p className="text-sm text-[#B8B8B8] mt-1">
                      Status:{" "}
                      <span
                        className={
                          dir.status === "PENDING"
                            ? "text-amber-400 font-semibold"
                            : "text-rose-400 font-semibold"
                        }
                      >
                        {dir.status}
                      </span>
                      {" · "}
                      {productCount} product{productCount === 1 ? "" : "s"} listed
                      {" · "}
                      Public page available after approval
                    </p>
                  </div>
                )}

                <div className="shrink-0 flex items-center gap-3">
                  {isPublic && (
                    <Link
                      href={`/suppliers/${dir.slug}`}
                      className="px-4 py-2 rounded-xl text-sm border border-[#292C30] text-[#CCCCCC] hover:bg-[#171A1E] transition"
                    >
                      View
                    </Link>
                  )}
                  {dir.isLiveEditable ? (
                    <Link
                      href={`/recruiter/directory/${dir.id}/edit`}
                      className="px-4 py-2 rounded-xl text-sm bg-[#0073FF] hover:bg-[#0060D0] text-white font-medium transition"
                    >
                      Edit
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="px-4 py-2 rounded-xl text-sm border border-[#292C30] text-[#B8B8B8] opacity-50 cursor-not-allowed"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <PackageLimitModal
          open={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          title="Directory slot limit reached"
          eligibility={listingEligibility}
          usedLabel="Directories"
          usedValue={listingEligibility?.activeListings}
          limitValue={listingEligibility?.effectiveLimit}
        />
      </div>
    </div>
  )
}

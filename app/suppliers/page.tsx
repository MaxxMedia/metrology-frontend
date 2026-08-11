"use client"

import { Suspense, useEffect, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react"
import SupplierRowCard from "./SupplierRowCard"
import SupplierFilters from "./SupplierFilters"

import StandOut from "@/components/suppliers/StandOut";
import Banner from "@/components/Banners/Banner";

type Supplier = {
  id: number
  name: string
  slug: string
  description: string
  location?: string
  logoUrl?: string
}

type FilterState = {
  name: string
  location: string
  category: string
  featuredOnly: boolean
  industryId: number | null
}

const PER_PAGE = 15

function SuppliersPageContent() {
  const searchParams = useSearchParams()
  const industryFromUrl = searchParams.get("industry") // e.g. "Additive Manufacturing"

  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("alphabetical")

  const [activeFilters, setActiveFilters] = useState<FilterState>({
    name: "",
    location: "",
    category: "",
    featuredOnly: false,
    industryId: null,
  })

  // ✅ Fetch suppliers from backend with filter params
  const fetchSuppliers = useCallback(async (filters: FilterState, page: number, sort: string) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.name)        params.set("name", filters.name)
      if (filters.location)    params.set("location", filters.location)
      if (filters.category)    params.set("category", filters.category)
      if (filters.featuredOnly) params.set("featured", "true")
      if (filters.industryId)  params.set("industryId", String(filters.industryId))

      params.set("page", String(page))
      params.set("limit", String(PER_PAGE))
      params.set("sort", sort)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers?${params.toString()}`
      )
      const data = await res.json()

      // Handle both { data: [], total: N } and plain []
      if (Array.isArray(data)) {
        setSuppliers(data)
        setTotal(data.length)
      } else {
        setSuppliers(data.data ?? [])
        setTotal(data.total ?? 0)
      }
    } catch (err) {
      console.error("Failed to fetch suppliers", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchSuppliers(activeFilters, currentPage, sortBy)
  }, [])

  // When filters change — reset to page 1
  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters)
    setCurrentPage(1)
    fetchSuppliers(filters, 1, sortBy)
  }

  // When sort changes
  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    fetchSuppliers(activeFilters, currentPage, sort)
  }

  // Prevent body scroll when mobile filters open
  useEffect(() => {
    document.body.style.overflow = showFilters ? "hidden" : "unset"
    return () => { document.body.style.overflow = "unset" }
  }, [showFilters])

  const totalPages = Math.ceil(total / PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchSuppliers(activeFilters, page, sortBy)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const getPaginationNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="min-h-screen w-full bg-[#171A1E] text-white">
      <div className="w-full max-w-full mx-auto px-4 lg:px-6 lg:pr-8 pt-0 pb-4 md:py-6">

        {/* MOBILE FILTER BUTTON */}
        <button
          onClick={() => setShowFilters(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#0073FF] text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#0060d6] transition-colors"
        >
          <SlidersHorizontal size={20} />
          <span className="text-[16px] font-semibold">Filters</span>
        </button>

        <div className="w-full grid grid-cols-1 lg:[grid-template-columns:300px_minmax(0,1fr)_360px] gap-6 lg:gap-8">

          {/* LEFT FILTERS — DESKTOP */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <SupplierFilters
                onFilterChange={handleFilterChange}
                initialIndustryName={industryFromUrl}
              />
            </div>
          </aside>

          {/* LEFT FILTERS — MOBILE MODAL */}
          {showFilters && (
            <>
              <div
                className="fixed inset-0 bg-black/70 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              <div className="fixed inset-y-0 left-0 w-full sm:w-[400px] bg-[#1D2125] text-white border-r border-[#292C30] z-50 overflow-y-auto lg:hidden">
                <div className="sticky top-0 bg-[#1D2125] border-b border-[#292C30] px-4 py-4 flex items-center justify-between">
                  <h3 className="text-[20px] font-bold text-[#F7F7F7]">Filters</h3>
                  <button onClick={() => setShowFilters(false)} className="text-[#CCCCCC] hover:text-white text-2xl">×</button>
                </div>
                <div className="p-4">
                  <SupplierFilters
                    onFilterChange={(f) => { handleFilterChange(f); setShowFilters(false) }}
                    initialIndustryName={industryFromUrl}
                  />
                </div>
                <div className="sticky bottom-0 bg-[#1D2125] border-t border-[#292C30] p-4">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-[#0073FF] text-white py-3 rounded-lg text-[15px] font-semibold hover:bg-[#0060d6] transition-colors"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </>
          )}

          {/* CENTER CONTENT */}
          <main className="space-y-4 md:space-y-6">

            {/* HERO */}
            <div className="relative w-full h-[96px] sm:h-[140px] md:h-[160px] rounded-xl overflow-hidden border border-[#292C30]">
              <img
                src="/images/search-landscape.jpg"
                alt="Find a Tooling Technology Supplier"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 flex items-center justify-center px-4">
                <h1 className="text-white text-[24px] font-bold text-center">
                  Find a Tooling Technology Supplier
                </h1>
              </div>
            </div>

            {/* BREADCRUMB */}
            <div className="text-[12px] text-[#B8B8B8]">
              <span className="underline cursor-pointer hover:text-white">Home</span>
              <span className="mx-2">›</span>
              <span className="font-medium text-white">Find a Supplier</span>
            </div>

            {/* SEARCH HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <h2 className="text-[24px] font-bold text-white">Search Results</h2>
                <p className="text-[#CCCCCC] mt-1 text-[12px]">
                  {loading ? "Loading..." : `${total} total supplier${total !== 1 ? "s" : ""}`}
                </p>
              </div>

              <select
                className="bg-[#1D2125] text-white border border-[#292C30] px-3 py-2 text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
                value={sortBy}
                onChange={e => handleSortChange(e.target.value)}
              >
                <option value="alphabetical">Alphabetical</option>
                <option value="newest">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* RESULTS */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0073FF] mx-auto mb-4"></div>
                  <p className="text-[16px] text-[#CCCCCC]">Loading suppliers...</p>
                </div>
              </div>
            ) : suppliers.length > 0 ? (
              <div className="space-y-4">
                {suppliers.map(s => (
                  <SupplierRowCard key={s.id} supplier={s} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#1D2125] rounded-xl border border-[#292C30]">
                <p className="text-[16px] text-[#CCCCCC]">No suppliers found.</p>
                <p className="text-[12px] text-[#B8B8B8] mt-1">Try adjusting your filters.</p>
              </div>
            )}
             

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-20 lg:pb-6">
                <div className="text-[12px] text-[#B8B8B8] sm:hidden">Page {currentPage} of {totalPages}</div>

                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                  <button
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 sm:w-10 sm:h-10 border border-[#292C30] flex items-center justify-center text-[12px] font-semibold rounded-lg transition-colors
                      ${currentPage === 1 ? "bg-[#1D2125] text-[#858585] cursor-not-allowed" : "bg-[#1D2125] text-white hover:bg-[#292C30]"}`}
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {getPaginationNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span key={`e-${idx}`} className="px-2 text-[#858585]">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 border text-[12px] font-semibold rounded-lg transition-colors
                          ${page === currentPage ? "bg-[#0073FF] border-[#0073FF] text-white" : "bg-[#1D2125] border-[#292C30] text-[#CCCCCC] hover:bg-[#292C30] hover:text-white"}`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 sm:w-10 sm:h-10 border border-[#292C30] flex items-center justify-center text-[12px] font-semibold rounded-lg transition-colors
                      ${currentPage === totalPages ? "bg-[#1D2125] text-[#858585] cursor-not-allowed" : "bg-[#1D2125] text-white hover:bg-[#292C30]"}`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="hidden sm:block text-[12px] text-[#B8B8B8]">Page {currentPage} of {totalPages}</div>
              </div>
            )}
             
          </main>

          {/* RIGHT ADS — DESKTOP */}
          <aside className="hidden lg:block" aria-label="Sponsored">
            <div className="sticky top-24">
              <Banner placement="SUPPLIER_RIGHT" />
            </div>
          </aside>

          {/* RIGHT ADS — MOBILE */}
          <div className="lg:hidden" aria-label="Sponsored">
            <Banner placement="SUPPLIER_RIGHT" />
          </div>

        </div>
          
      </div>
      {/* Stand Out Section */}
      <StandOut />
    
      {/* Banner after Stand Out */}
      <Banner placement="SUPPLIER_AFTER_VIDEO" />
    </div>
  )
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={null}>
      <SuppliersPageContent />
    </Suspense>
  )
}
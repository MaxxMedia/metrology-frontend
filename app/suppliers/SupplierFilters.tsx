"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronDown, Search, MapPin, Tag, X, Loader2 } from "lucide-react"

type Industry = {
  id: number
  name: string
  hasChildren?: boolean
}

type FilterState = {
  name: string
  location: string
  category: string
  featuredOnly: boolean
  industryId: number | null
  ranking: "all" | "basic" | "professional" | "enterprise"
}

type Props = {
  onFilterChange?: (filters: FilterState) => void
  initialIndustryName?: string | null
}

export default function SupplierFilters({ onFilterChange, initialIndustryName }: Props) {
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loadingIndustries, setLoadingIndustries] = useState(true)

  // Expanded accordion sections
  const [openSections, setOpenSections] = useState<Set<number>>(new Set())

  // Children cache: parentId → children[]
  const [childrenCache, setChildrenCache] = useState<Record<number, Industry[]>>({})
  const [loadingChildren, setLoadingChildren] = useState<Set<number>>(new Set())

  const [filters, setFilters] = useState<FilterState>({
    name: "",
    location: "",
    category: "",
    featuredOnly: false,
    industryId: null,
    ranking: "all",
  })

  // Debounced filter emit
  const [debounceTimer, setDebounceTimer] = useState<any>(null)

  const emitFilters = useCallback((newFilters: FilterState) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      onFilterChange?.(newFilters)
    }, 400)
    setDebounceTimer(timer)
  }, [debounceTimer, onFilterChange])

  const updateFilter = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value }
    setFilters(updated)
    emitFilters(updated)
  }

  const clearFilters = () => {
    const cleared: FilterState = {
      name: "",
      location: "",
      category: "",
      featuredOnly: false,
      industryId: null,
      ranking: "all",
    }
    setFilters(cleared)
    onFilterChange?.(cleared)
  }

  // Fetch root industries
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries`)
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data.data ?? []
        setIndustries(list)
      })
      .catch(err => console.error("Failed to load industries", err))
      .finally(() => setLoadingIndustries(false))
  }, [])

  // Shared helper: fetch + cache children for any industry id (root or child)
  const loadChildren = useCallback(async (id: number) => {
    if (childrenCache[id]) return // already cached
    setLoadingChildren(prev => new Set(prev).add(id))
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/industries/${id}/children`
      )
      const children = await res.json()
      setChildrenCache(prev => ({ ...prev, [id]: Array.isArray(children) ? children : children.data ?? [] }))
    } catch (err) {
      console.error("Failed to load children", err)
      setChildrenCache(prev => ({ ...prev, [id]: [] }))
    } finally {
      setLoadingChildren(prev => {
        const s = new Set(prev)
        s.delete(id)
        return s
      })
    }
  }, [childrenCache])

  // Once industries are loaded, if we were told to pre-select one (e.g. from
  // a "Browse by Industry" link elsewhere on the site), find it, select it,
  // expand its accordion, AND fetch its children so they actually render.
  useEffect(() => {
    if (!initialIndustryName || industries.length === 0) return

    const match = industries.find(
      (i) => i.name.trim().toLowerCase() === initialIndustryName.trim().toLowerCase()
    )
    if (!match) return

    // Select it (this also triggers onFilterChange up to the parent)
    const preselected: FilterState = { ...filters, industryId: match.id }
    setFilters(preselected)
    onFilterChange?.(preselected)

    // Expand its accordion section and load its children
    setOpenSections((prev) => new Set(prev).add(match.id))
    loadChildren(match.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialIndustryName, industries])

  // Toggle section open/close + lazy load children
  const toggleSection = async (industryId: number) => {
    const newOpen = new Set(openSections)

    if (newOpen.has(industryId)) {
      newOpen.delete(industryId)
    } else {
      newOpen.add(industryId)
      await loadChildren(industryId)
    }

    setOpenSections(newOpen)
  }

  // Fetch grandchildren when a child section is opened
  const toggleChildSection = async (childId: number) => {
    const newOpen = new Set(openSections)

    if (newOpen.has(childId)) {
      newOpen.delete(childId)
    } else {
      newOpen.add(childId)
      await loadChildren(childId)
    }

    setOpenSections(newOpen)
  }

  const selectIndustry = (id: number) => {
    const newId = filters.industryId === id ? null : id
    updateFilter("industryId", newId)
  }

  const hasActiveFilters =
    filters.name || filters.location || filters.category ||
    filters.featuredOnly || filters.industryId !== null || filters.ranking !== "all"

  return (
    <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-5 shadow-sm text-white">

      {/* FILTER HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#292C30]">
        <h3 className="text-lg font-bold text-[#F7F7F7]">Refine Search</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-[#00B5ED] font-semibold hover:underline"
          >
            Reset
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4">

        {/* INPUT FILTERS */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <input
              className="w-full bg-[#171A1E] border border-[#292C30] rounded-lg pl-10 pr-8 py-2.5 text-sm text-white placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
              placeholder="Search by company name..."
              value={filters.name}
              onChange={e => updateFilter("name", e.target.value)}
            />
            {filters.name && (
              <button onClick={() => updateFilter("name", "")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#858585] hover:text-white" />
              </button>
            )}
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <input
              className="w-full bg-[#171A1E] border border-[#292C30] rounded-lg pl-10 pr-8 py-2.5 text-sm text-white placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
              placeholder="Search by location..."
              value={filters.location}
              onChange={e => updateFilter("location", e.target.value)}
            />
            {filters.location && (
              <button onClick={() => updateFilter("location", "")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#858585] hover:text-white" />
              </button>
            )}
          </div>

          <div className="relative">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585]" />
            <input
              className="w-full bg-[#171A1E] border border-[#292C30] rounded-lg pl-10 pr-8 py-2.5 text-sm text-white placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
              placeholder="Search by product category..."
              value={filters.category}
              onChange={e => updateFilter("category", e.target.value)}
            />
            {filters.category && (
              <button onClick={() => updateFilter("category", "")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#858585] hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* RANKING FILTER DROPDOWN */}
        <div className="relative">
          <select
            className="w-full bg-[#171A1E] border border-[#292C30] text-white rounded-lg pl-3 pr-10 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
            value={filters.ranking}
            onChange={e => updateFilter("ranking", e.target.value)}
          >
            <option value="all">All Rankings</option>
            <option value="basic">Standard (Basic)</option>
            <option value="professional">Priority (Professional)</option>
            <option value="enterprise">Top Results (Enterprise)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#858585] pointer-events-none" />
        </div>

        {/* FEATURED CHECKBOX */}
        <label className="flex items-center gap-3 p-3 bg-[#1D247B] border border-[#292C30] rounded-lg cursor-pointer hover:bg-[#1D247B]/80 transition">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={e => updateFilter("featuredOnly", e.target.checked)}
            className="w-4 h-4 text-[#0073FF] border-[#292C30] rounded focus:ring-2 focus:ring-[#0073FF]"
          />
          <span className="font-semibold text-sm text-white flex items-center gap-2">
            ⭐ Featured Suppliers Only
          </span>
        </label>

        {/* DIVIDER */}
        <div className="border-t border-[#292C30]" />

        {/* INDUSTRY FILTER TREE */}
        <div>
          <p className="text-xs font-semibold text-[#858585] uppercase tracking-wide mb-2">
            Browse by Industry
          </p>

          {loadingIndustries ? (
            <div className="flex items-center justify-center py-8 gap-2 text-[#858585]">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading industries...</span>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
              {industries.map(industry => {
                const isOpen = openSections.has(industry.id)
                const children = childrenCache[industry.id] ?? []
                const isLoadingChildren = loadingChildren.has(industry.id)
                const isSelected = filters.industryId === industry.id

                return (
                  <div key={industry.id} className="border border-[#292C30] rounded-lg overflow-hidden bg-[#171A1E]">

                    {/* ROOT LEVEL */}
                    <div className="flex items-center">
                      {/* Checkbox to select this industry */}
                      <label className="flex items-center pl-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selectIndustry(industry.id)}
                          className="w-4 h-4 text-[#0073FF] border-[#292C30] rounded focus:ring-2 focus:ring-[#0073FF] cursor-pointer"
                        />
                      </label>

                      {/* Toggle accordion */}
                      <button
                        onClick={() => toggleSection(industry.id)}
                        className={`flex-1 flex items-center justify-between px-3 py-2.5 text-left transition
                          ${isSelected ? "bg-[#00B5ED]/10" : "hover:bg-[#292C30]/50"}`}
                      >
                        <span className={`text-sm font-semibold ${isSelected ? "text-[#00B5ED]" : "text-white"}`}>
                          {industry.name}
                        </span>
                        <div className="flex items-center gap-1">
                          {isLoadingChildren && <Loader2 size={12} className="animate-spin text-[#858585]" />}
                          <ChevronDown
                            className={`w-4 h-4 text-[#858585] transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>
                    </div>

                    {/* LEVEL 2 CHILDREN */}
                    {isOpen && (
                      <div className="border-t border-[#292C30] bg-[#1D2125]">
                        {isLoadingChildren ? (
                          <div className="flex items-center gap-2 px-4 py-3 text-[#858585]">
                            <Loader2 size={12} className="animate-spin" />
                            <span className="text-xs">Loading...</span>
                          </div>
                        ) : children.length === 0 ? (
                          <p className="text-xs text-[#858585] px-4 py-3">No sub-categories</p>
                        ) : (
                          <div className="py-1">
                            {children.map(child => {
                              const childOpen = openSections.has(child.id)
                              const grandchildren = childrenCache[child.id] ?? []
                              const isLoadingGrand = loadingChildren.has(child.id)
                              const childSelected = filters.industryId === child.id

                              return (
                                <div key={child.id}>

                                  {/* LEVEL 2 ROW */}
                                  <div className="flex items-center">
                                    <label className="flex items-center pl-6 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={childSelected}
                                        onChange={() => selectIndustry(child.id)}
                                        className="w-3.5 h-3.5 text-[#0073FF] border-[#292C30] rounded focus:ring-2 focus:ring-[#0073FF] cursor-pointer"
                                      />
                                    </label>
                                    <button
                                      onClick={() => toggleChildSection(child.id)}
                                      className={`flex-1 flex items-center justify-between px-3 py-2 text-left transition
                                        ${childSelected ? "bg-[#00B5ED]/10" : "hover:bg-[#292C30]/50"}`}
                                    >
                                      <span className={`text-xs font-medium ${childSelected ? "text-[#00B5ED]" : "text-[#CCCCCC]"}`}>
                                        {child.name}
                                      </span>
                                      <div className="flex items-center gap-1">
                                        {isLoadingGrand && <Loader2 size={10} className="animate-spin text-[#858585]" />}
                                        <ChevronDown
                                          className={`w-3 h-3 text-[#858585] transition-transform flex-shrink-0 ${childOpen ? "rotate-180" : ""}`}
                                        />
                                      </div>
                                    </button>
                                  </div>

                                  {/* LEVEL 3 GRANDCHILDREN */}
                                  {childOpen && (
                                    <div className="bg-[#171A1E] border-t border-[#292C30]">
                                      {isLoadingGrand ? (
                                        <div className="flex items-center gap-2 px-8 py-2 text-[#858585]">
                                          <Loader2 size={10} className="animate-spin" />
                                          <span className="text-xs">Loading...</span>
                                        </div>
                                      ) : grandchildren.length === 0 ? (
                                        <p className="text-xs text-[#858585] px-8 py-2">No sub-categories</p>
                                      ) : (
                                        grandchildren.map(grand => {
                                          const grandSelected = filters.industryId === grand.id
                                          return (
                                            <label
                                              key={grand.id}
                                              className={`flex items-center gap-2.5 px-8 py-2 cursor-pointer transition
                                                ${grandSelected ? "bg-[#00B5ED]/10" : "hover:bg-[#292C30]/50"}`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={grandSelected}
                                                onChange={() => selectIndustry(grand.id)}
                                                className="w-3 h-3 text-[#0073FF] border-[#292C30] rounded focus:ring-2 focus:ring-[#0073FF] cursor-pointer"
                                              />
                                              <span className={`text-xs ${grandSelected ? "text-[#00B5ED] font-medium" : "text-[#CCCCCC]"}`}>
                                                {grand.name}
                                              </span>
                                            </label>
                                          )
                                        })
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* CLEAR FILTERS BUTTON */}
        <button
          onClick={clearFilters}
          disabled={!hasActiveFilters}
          className="w-full mt-2 py-2.5 text-sm font-semibold text-[#00B5ED] border border-[#00B5ED] rounded-lg hover:bg-[#00B5ED] hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
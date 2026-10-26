"use client";
/** Implements the company company header component and its related interface behavior. */


import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle, MapPin } from "lucide-react";

type Company = {
  id: number;
  name: string;
  slug: string;
  tagline?: string;
  industry?: string;
  location?: string;
  companySize?: string;
  website?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  followers: number;
  isVerified: boolean;
};

type CompanyHeaderProps = {
  company: Company;
  isFollowing?: boolean;
  onFollow?: () => void;
};

/** Renders the company header interface. */
export default function CompanyHeader({
  company,
  isFollowing = false,
  onFollow,
}: CompanyHeaderProps) {
  const [displayName, setDisplayName] = useState(company.name)
  const [nameDraft, setNameDraft] = useState(company.name)
  const [isCompanyOwner, setIsCompanyOwner] = useState(false)
  const [editingName, setEditingName] = useState(false)
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState("")

  useEffect(() => {
    setDisplayName(company.name)
    setNameDraft(company.name)
  }, [company.id, company.name])

  useEffect(() => {
    let cancelled = false
    const token = localStorage.getItem("token")
    if (!token) {
      setIsCompanyOwner(false)
      return
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((profile) => {
        if (!cancelled) setIsCompanyOwner(profile?.Company?.id === company.id)
      })
      .catch(() => {
        if (!cancelled) setIsCompanyOwner(false)
      })

    return () => { cancelled = true }
  }, [company.id])

  /** Saves the company name data for this workflow. */
  async function saveCompanyName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextName = nameDraft.trim()
    if (nextName.length < 3 || nextName.length > 100) {
      setNameError("Company name must be between 3 and 100 characters.")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      setNameError("Please sign in again to edit this company.")
      return
    }

    setSavingName(true)
    setNameError("")
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recruiters/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ companyName: nextName }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Could not update company name")

      const savedName = data.Company?.name || nextName
      setDisplayName(savedName)
      setNameDraft(savedName)
      setEditingName(false)
    } catch (error) {
      setNameError(error instanceof Error ? error.message : "Could not update company name")
    } finally {
      setSavingName(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">

      {/* Banner */}
      <div
        className="h-48 bg-gradient-to-r from-slate-800 to-slate-900"
        style={
          company.coverImageUrl
            ? {
                backgroundImage: `url(${company.coverImageUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}
        }
      />

      <div className="p-6 flex gap-6">

        <div className="relative w-28 h-28 -mt-16">
          <Image
            src={
              company.logoUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`
            }
            alt={displayName}
            fill
            className="rounded-lg border bg-white object-contain"
          />
        </div>

        <div className="flex-1">

          <div className="flex flex-wrap items-center gap-2">
            {editingName ? (
              <form onSubmit={saveCompanyName} className="flex flex-wrap items-center gap-2">
                <input value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} aria-label="Company name" autoFocus required minLength={3} maxLength={100} className="rounded-md border px-3 py-2 text-base font-semibold text-black" />
                <button type="submit" disabled={savingName} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50">{savingName ? "Saving..." : "Save"}</button>
                <button type="button" disabled={savingName} onClick={() => { setNameDraft(displayName); setEditingName(false); setNameError("") }} className="rounded-md border px-3 py-2 text-sm text-black">Cancel</button>
              </form>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-black">{displayName}</h1>
                {company.isVerified && <CheckCircle size={18} className="text-blue-600" />}
                {isCompanyOwner && <button type="button" onClick={() => { setNameDraft(displayName); setEditingName(true) }} className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50">Edit name</button>}
              </>
            )}
          </div>
          {nameError && <p role="alert" className="mt-2 text-sm text-red-600">{nameError}</p>}

          {company.tagline && (
            <p className="mt-1 text-black">
              {company.tagline}
            </p>
          )}

          <div className="mt-2 text-sm text-black space-y-1">

            {company.industry && (
              <p>{company.industry}</p>
            )}

            {company.location && (
              <p className="flex items-center gap-1">
                <MapPin size={14} />
                {company.location}
              </p>
            )}

            {company.companySize && (
              <p>{company.companySize}</p>
            )}

            <p>{company.followers} followers</p>

          </div>

          {/* ACTIONS - Follow and Visit Website */}
          <div className="flex gap-3 mt-4">
            {onFollow && (
              <button
                onClick={onFollow}
                className={`px-5 py-1.5 rounded-full text-sm font-medium ${
                  isFollowing
                    ? "border text-gray-700"
                    : "bg-blue-600 text-white"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}

            {company.website && (
              <Link
                href={company.website}
                target="_blank"
                className="border px-5 py-1.5 rounded-full text-sm text-black"
              >
                Visit website
              </Link>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}



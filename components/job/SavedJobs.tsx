"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Clock, Bookmark } from "lucide-react";

type SavedJob = {
  id: number;
  createdAt: string;
  Job: {
    id: number;
    title: string;
    slug: string;
    location: string;
    employmentType: string;
    Company?: {
      name: string;
      slug: string;
    };
    companyName?: string;
  };
};

export default function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSavedJobs() {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in as a candidate to view saved jobs.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/saved/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load saved jobs.");
          setSavedJobs([]);
          return;
        }

        if (Array.isArray(data)) {
          setSavedJobs(data);
        } else {
          // Backend returned something unexpected — surface it instead
          // of silently showing "No saved jobs yet."
          console.error("Unexpected saved jobs response shape:", data);
          setError("Unexpected response from server.");
        }
      } catch (err) {
        console.error("Failed to load saved jobs", err);
        setError("Something went wrong while loading saved jobs.");
      } finally {
        setLoading(false);
      }
    }

    loadSavedJobs();
  }, []);

  async function handleUnsave(jobId: number) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${jobId}/save`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to remove saved job.");
        return;
      }

      setSavedJobs((prev) => prev.filter((job) => job.Job.id !== jobId));
    } catch (err) {
      console.error("Failed to unsave job", err);
      alert("Something went wrong. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-6 text-[#CCCCCC]">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#00B5ED] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading saved jobs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-6">
        <p className="text-rose-400 bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1D2125] border border-[#292C30] rounded-xl p-6 text-[#CCCCCC]">
      <h2 className="text-2xl font-bold mb-6 text-[#FFFFFF]">Saved Jobs</h2>

      {savedJobs.length === 0 ? (
        <p className="text-[#858585]">No saved jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((saved) => (
            <div
              key={saved.id}
              className="rounded-xl p-5 bg-[#171A1E] border border-[#292C30] hover:border-[#00B5ED]/40 transition shadow-sm"
            >
              <Link
                href={
                  saved.Job.Company?.slug
                    ? `/company/${saved.Job.Company.slug}`
                    : `/jobs/${saved.Job.slug}`
                }
                className="text-xs text-[#00B5ED] font-semibold hover:underline uppercase tracking-wider"
              >
                {saved.Job.Company?.name ||
                  saved.Job.companyName ||
                  "Company"}
              </Link>

              <Link
                href={`/jobs/${saved.Job.slug}`}
                className="block text-lg font-bold text-white mt-1 hover:text-[#00B5ED] transition-colors"
              >
                {saved.Job.title}
              </Link>

              <div className="flex flex-wrap gap-4 text-xs text-[#B8B8B8] mt-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} className="text-[#00B5ED]" />
                  {saved.Job.location}
                </span>

                <span className="flex items-center gap-1">
                  <Clock size={14} className="text-[#00B5ED]" />
                  Saved on{" "}
                  {new Date(saved.createdAt).toLocaleDateString()}
                </span>

                <span className="bg-[#1D2125] border border-[#292C30] px-2.5 py-0.5 rounded-full text-[#CCCCCC]">
                  {saved.Job.employmentType}
                </span>
              </div>

              <button
                onClick={() => handleUnsave(saved.Job.id)}
                className="mt-4 flex items-center gap-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition"
              >
                <Bookmark size={15} className="fill-rose-400 text-rose-400" />
                Remove from saved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
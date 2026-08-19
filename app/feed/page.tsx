"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import JobFeed from "@/components/job/JobFeed";
import LocationAutocomplete from "@/components/job/Locationautocomplete";
import Link from "next/link";
import Banner from "@/components/Banners/Banner";

export default function PublicFeedPage() {
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const [filters, setFilters] = useState({
    type: "",
    category: "",
    remote: false,
    location: "",
  });

  const handleFilterChange = (
    field: string,
    value: string | boolean
  ) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    (document.activeElement as HTMLElement | null)?.blur();
    document
      .getElementById("job-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingRole(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setRole(payload.role?.toLowerCase() || null);
    } catch (err) {
      console.error(err);
      setRole(null);
    } finally {
      setLoadingRole(false);
    }
  }, []);

  /* ---------------- HERO CONTENT ---------------- */

  const heroContent = {
    guest: {
      badge: "Manufacturing • Engineering • Technology",
      title1: "Manufacturing Careers",
      title2: "& Hiring Made Easy",
      description:
        "Connect skilled professionals with leading manufacturing companies. Explore exciting career opportunities or recruit top talent—all in one platform.",
    },

    candidate: {
      badge: "Find Your Dream Job",
      title1: "Find Your Next",
      title2: "Manufacturing Career",
      description:
        "Explore manufacturing, engineering, automation, CNC machining and industrial technology opportunities from trusted employers worldwide.",
    },

    recruiter: {
      badge: "Recruit Top Talent",
      title1: "Hire the Best",
      title2: "Manufacturing Talent",
      description:
        "Reach qualified engineers, CNC operators, maintenance technicians and production specialists to grow your workforce faster.",
    },
  };

  const hero =
    role === "candidate"
      ? heroContent.candidate
      : role === "recruiter"
      ? heroContent.recruiter
      : heroContent.guest;

  return (
    <div className="bg-[#0a0d14] text-white min-h-screen relative" style={{ fontFamily: "'Inter Tight', sans-serif" }}>

      {/* ================= HERO ================= */}

      <section className="relative bg-[#0a0d14] border-b border-[#292C30] overflow-hidden min-h-[420px] md:min-h-[480px]">
        {/* Background image — anchored right so it stays visible beside the copy */}
        <div className="absolute inset-0">
          <Image
            src="/images/hirings.png"
            alt="Metrology Hiring Platform"
            fill
            priority
            className="object-cover object-[70%_center] md:object-right opacity-55 md:opacity-65"
            sizes="100vw"
          />
        </div>

        {/* Dark fade on the left for text contrast; lighter on the right so the image shows through */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d14] via-[#0a0d14]/70 to-[#0a0d14]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_40%,rgba(0,115,255,0.18),transparent_45%)]" />
        <div className="relative max-w-[1200px] mx-auto px-6 py-14 md:py-16">
          {!loadingRole && (
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#0073FF]/20 border border-[#0073FF]/40 px-3.5 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#00B5ED] animate-pulse"></span>
                  <span className="text-xs md:text-sm font-bold tracking-wide uppercase text-[#00B5ED]">
                    {hero.badge}
                  </span>
                </div>

                <h1 className="mt-7 text-4xl md:text-6xl font-extrabold leading-tight text-white">
                  {hero.title1}{" "}
                  <span className="block text-[#00B5ED]">
                    {hero.title2}
                  </span>
                </h1>

                <p className="mt-4 text-base md:text-lg leading-relaxed text-gray-400 max-w-xl">
                  {hero.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {(!role || role === "candidate") && (
                  <Link
                    href={
                      role === "candidate"
                        ? "#job-results"
                        : "/signup?role=candidate"
                    }
                    className="inline-flex w-[180px] h-[50px] items-center justify-center rounded-xl bg-[#0073FF] text-white text-base font-bold shadow-lg shadow-[#0073FF]/20 hover:bg-[#0060D0] transition-all duration-300"
                  >
                    Apply for Jobs
                  </Link>
                )}

                {(!role || role === "recruiter") && (
                  <Link
                    href={
                      role === "recruiter"
                        ? "/recruiter/jobs/new"
                        : "/signup?role=recruiter"
                    }
                    className="inline-flex w-[180px] h-[50px] items-center justify-center rounded-xl border border-[#292C30] text-[#CCCCCC] bg-[#1D2125] text-base font-bold hover:border-[#00B5ED] hover:text-[#00B5ED] transition-all duration-300"
                  >
                    Post a Job
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= FILTER BAR ================= */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-[#1D2125] rounded-2xl shadow-xl shadow-black/20 border border-[#292C30] px-6 py-5">
          <div className="flex flex-col md:flex-row md:items-end gap-5">

            {/* Type */}
            <div className="w-full md:w-[150px]">
              <label className="block text-[11px] font-semibold tracking-wide text-[#B8B8B8] uppercase mb-1">
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
                className="w-full text-sm bg-[#171A1E] text-white border border-[#292C30] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
              >
                <option value="" className="bg-[#171A1E] text-white">Any</option>
                <option value="full-time" className="bg-[#171A1E] text-white">Full Time</option>
                <option value="internship" className="bg-[#171A1E] text-white">Internship</option>
              </select>
            </div>

            {/* Category */}
            <div className="w-full md:w-[170px]">
              <label className="block text-[11px] font-semibold tracking-wide text-[#B8B8B8] uppercase mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) =>
                  handleFilterChange("category", e.target.value)
                }
                className="w-full text-sm bg-[#171A1E] text-white border border-[#292C30] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0073FF]"
              >
                <option value="" className="bg-[#171A1E] text-white">Any</option>
                <option value="manufacturing" className="bg-[#171A1E] text-white">Manufacturing</option>
                <option value="engineering" className="bg-[#171A1E] text-white">Engineering</option>
                <option value="technology" className="bg-[#171A1E] text-white">Technology</option>
                <option value="design" className="bg-[#171A1E] text-white">Design</option>
              </select>
            </div>

            {/* Remote */}
            <div className="w-full md:w-auto">
              <label className="block text-[11px] font-semibold tracking-wide text-[#B8B8B8] uppercase mb-1">
                Remote?
              </label>

              <label className="flex items-center gap-2 h-[38px] text-sm text-[#CCCCCC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.remote}
                  onChange={(e) =>
                    handleFilterChange("remote", e.target.checked)
                  }
                  className="w-4 h-4 rounded border-[#292C30] text-[#0073FF] focus:ring-[#0073FF]"
                />
                Yes
              </label>
            </div>

            {/* Location */}
            <div className="w-full md:flex-1">
              <label className="block text-[11px] font-semibold tracking-wide text-[#B8B8B8] uppercase mb-1">
                Location
              </label>

              <LocationAutocomplete
                value={filters.location}
                onChange={(val) => handleFilterChange("location", val)}
              />
            </div>

            {/* Search */}
            <div className="w-full md:w-auto">
              <button
                onClick={handleSearch}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#0073FF] hover:bg-[#0060D0] text-white text-sm font-bold px-7 py-2.5 rounded-lg shadow-md shadow-[#0073FF]/20 transition-all duration-200 whitespace-nowrap"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>

                Search
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ================= JOB LIST ================= */}
      <section
        id="job-results"
        className="max-w-[1200px] mx-auto px-4 py-14"
      >
        <div className="mb-10">
          <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-white">
              Explore Feed
            </h2>
            <span className="h-0.5 w-10 bg-[#0073FF]" />
          </div>

          <p className="mt-3 text-sm text-gray-400 max-w-2xl">
            Browse the latest manufacturing, engineering, tooling,
            automation, and industrial technology opportunities from
            employers around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* Job Feed */}
          <div>
            <JobFeed isPublic filters={filters} />
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              <Banner placement="JOB_RIGHT" />
            </div>
          </aside>

        </div>
      </section>

    </div>
  );
}
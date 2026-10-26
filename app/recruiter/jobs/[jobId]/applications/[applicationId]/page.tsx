"use client";
/** Implements the recruiter jobs job id applications application id page and its route-specific behavior. */


import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Mail, Clock, FileText, Loader2 } from "lucide-react";
import { downloadFile } from "@/lib/Downloadfile"

type Application = {
  id: number;
  resumeUrl: string | null;
  coverNote: string | null;
  status: string;
  createdAt: string;

  User: {
    id: number;
    fullName: string | null;
    email: string;
    headline: string | null;
  };

  Job: {
    title: string;
    location: string;
    employmentType: string;
    Company: {
      name: string;
    } | null;
  } | null;
};

/** Renders the applicant details page interface. */
export default function ApplicantDetailsPage() {
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    /** Loads application for the current workflow. */
    async function loadApplication() {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch application");
        }

        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadApplication();
  }, [applicationId]);

  // Uses the shared downloadFile() util — it sniffs the real file type from
  // the bytes instead of forcing "application/pdf", so we never silently
  // save a corrupted/junk file if Cloudinary returns an error page instead
  // of the actual resume.
  async function handleDownloadResume(url: string | null, fileName: string) {
    if (!url) {
      return;
    }

    setDownloading(true);
    const result = await downloadFile(url, fileName);
    setDownloading(false);

    if (!result.success) {
      alert(result.error || "Could not download resume. Please try again.");
    }
  }

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!application) {
    return <div className="p-10">Application not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc] px-6 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {application.User.fullName || "Candidate"}
            </h1>

            <p className="text-gray-500 mt-2">
              {application.User.headline || "No headline"}
            </p>
          </div>

          <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 capitalize">
            {application.status}
          </span>
        </div>

        <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Mail size={16} />
            {application.User.email}
          </span>

          <span className="flex items-center gap-2">
            <Clock size={16} />
            {new Date(application.createdAt).toLocaleDateString()}
          </span>
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className="font-semibold">Job</p>
            <p>{application.Job?.title}</p>
          </div>

          <div>
            <p className="font-semibold">Company</p>
            <p>{application.Job?.Company?.name}</p>
          </div>

          <div>
            <p className="font-semibold">Location</p>
            <p>{application.Job?.location}</p>
          </div>

          <div>
            <p className="font-semibold">Employment Type</p>
            <p>{application.Job?.employmentType}</p>
          </div>
        </div>

        {/* Resume */}
        {application.resumeUrl && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Resume</h3>

            <button
              onClick={() =>
             handleDownloadResume(
  application.resumeUrl,
  `${application.User.fullName || "Resume"}.pdf`
)
              }
              disabled={downloading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-60"
            >
              {downloading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Download Resume
                </>
              )}
            </button>
          </div>
        )}

        {/* Cover Note */}
        {application.coverNote && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Cover Note</h3>

            <div className="bg-gray-100 rounded-lg p-4 whitespace-pre-wrap">
              {application.coverNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
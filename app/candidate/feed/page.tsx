"use client";
/** Implements the candidate feed page and its route-specific behavior. */


import { useEffect, useState } from "react";
import CandidateLinkedInProfile from "@/components/candidate/CandidateLinkedInProfile";
import { fetchMyCandidateProfile } from "@/lib/candidateProfile";

/** Renders the candidate feed page interface. */
export default function CandidateFeedPage() {
  const [username, setUsername] = useState<string | null>(null);
  const [profileUnavailable, setProfileUnavailable] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.username) {
          setUsername(u.username);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchMyCandidateProfile()
      .then((me) => {
        if (me.username) setUsername(me.username);
        else setProfileUnavailable(true);
      })
      .catch(() => setProfileUnavailable(true));
  }, []);

  if (profileUnavailable) {
    return (
      <div className="bg-[#f3f2ef] min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md rounded-lg bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-gray-900">Your candidate profile could not be loaded</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in again and retry.</p>
          <a href="/login?redirect=%2Fcandidate%2Ffeed" className="mt-4 inline-block text-blue-700 underline">Sign in</a>
        </div>
      </div>
    );
  }

  if (!username) {
    return (
      <div className="bg-[#f3f2ef] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0a66c2] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium text-sm">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  return <CandidateLinkedInProfile username={username} />;
}

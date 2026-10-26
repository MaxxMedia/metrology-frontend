"use client";
/** Implements the subscribe thankyou page and its route-specific behavior. */


import Link from "next/link";

/** Renders the mmtthank you page interface. */
export default function MMTThankYouPage() {
  return (
    <div className="min-h-[70vh] w-full bg-white flex flex-col items-center py-20 px-6">

      {/* HEADER STRIP */}
      <div className="w-full max-w-2xl bg-[#004d73] text-white text-2xl font-bold py-4 text-center rounded-t-xl shadow">
        Thank You!
      </div>

      {/* MAIN CARD */}
      <div className="w-full max-w-2xl bg-white border border-gray-200 shadow-lg rounded-b-xl px-10 py-12 text-center">

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          You’re Successfully Subscribed!
        </h2>

        <p className="text-lg text-gray-800 font-semibold mb-4">
          Welcome to the Metrology Community
        </p>

        <p className="text-gray-600 leading-relaxed mb-8">
          Thank you for subscribing to Metrology. You’ll now receive industry insights,  
          tooling design news, machining techniques, and much more — straight to your inbox.
        </p>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200 my-6" />

        <p className="text-gray-500 text-sm mb-10">
          Stay updated with the latest in Toolmaking, manufacturing,  
          and advanced metrology.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/topics"
            className="rounded-full bg-cyan-100 px-5 py-3 text-[#004d73] font-semibold hover:bg-cyan-200 transition"
          >
            Explore Topics
          </Link>

          <Link
            href="/"
            className="rounded-full bg-cyan-100 px-5 py-3 text-[#004d73] font-semibold hover:bg-cyan-200 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

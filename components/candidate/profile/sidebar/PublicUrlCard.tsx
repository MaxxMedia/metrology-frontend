"use client";
/** Implements the candidate profile sidebar public url card component and its related interface behavior. */


interface PublicUrlCardProps {
  username?: string;
}

/** Renders the public url card interface. */
export default function PublicUrlCard({ username }: PublicUrlCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#e0e0e0] p-5 shadow-sm">
      <h4 className="font-bold text-xs text-[#5A5F69] uppercase tracking-wider mb-2">Public Profile & URL</h4>
      <p className="text-xs text-[#0F5B78] font-mono break-all font-medium">
        {typeof window !== 'undefined' ? `${window.location.origin}/candidate/${username || ''}` : `/candidate/${username || ''}`}
      </p>
    </div>
  );
}

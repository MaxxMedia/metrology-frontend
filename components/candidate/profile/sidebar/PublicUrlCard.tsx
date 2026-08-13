"use client";

interface PublicUrlCardProps {
  username?: string;
}

export default function PublicUrlCard({ username }: PublicUrlCardProps) {
  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-5 shadow-sm">
      <h4 className="font-bold text-xs text-[#a1a1a1] uppercase tracking-wider mb-2">Public Profile & URL</h4>
      <p className="text-xs text-[#0073ff] font-mono break-all font-medium">
        {typeof window !== 'undefined' ? `${window.location.origin}/candidate/${username || ''}` : `/candidate/${username || ''}`}
      </p>
    </div>
  );
}

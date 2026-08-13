"use client";

import { Pencil, Mail, Globe } from "lucide-react";

interface ContactCardProps {
  candidate?: any;
  isOwner?: boolean;
  onEditClick?: () => void;
}

export default function ContactCard({ candidate, isOwner, onEditClick }: ContactCardProps) {
  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
      {isOwner && onEditClick && (
        <button
          onClick={onEditClick}
          title="Edit Contact & Social Links"
          className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
        >
          <Pencil size={16} />
        </button>
      )}

      <h3 className="text-base font-bold text-white mb-4">Contact & Socials</h3>

      <div className="space-y-3.5 text-xs sm:text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0073ff]/10 flex items-center justify-center text-[#0073ff] shrink-0">
            <Mail size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#a1a1a1] font-medium">Email</p>
            <p className="font-semibold text-white truncate">
              {candidate?.email || "Not specified"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0073ff]/10 flex items-center justify-center text-[#0073ff] shrink-0">
            <Globe size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#a1a1a1] font-medium">Website</p>
            {candidate?.websiteUrl ? (
              <a
                href={candidate.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-[#0073ff] hover:underline truncate block"
              >
                {candidate.websiteUrl}
              </a>
            ) : (
              <p className="font-semibold text-[#a1a1a1] truncate">Not specified</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

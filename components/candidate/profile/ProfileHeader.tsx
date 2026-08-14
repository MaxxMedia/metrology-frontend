"use client";

import { Pencil, Camera, CheckCircle, MapPin, UserPlus, FileUp, Download, Loader2 } from "lucide-react";
import CandidateAvatar from "@/components/candidate/CandidateAvatar";
import ConnectionButton from "@/components/network/ConnectionButton";

interface ProfileHeaderProps {
  displayName: string;
  displayHeadline: string;
  displayCompany: string;
  displayEducation: string;
  displayLocation: string;
  avatarUrl?: string;
  isOwner?: boolean;
  targetUserId?: number;
  onEditIntroClick: () => void;
  resume?: { fileName?: string; fileUrl?: string } | null;
  onResumeUpload?: (file: File) => Promise<void>;
  resumeUploading?: boolean;
}

export default function ProfileHeader({
  displayName,
  displayHeadline,
  displayCompany,
  displayEducation,
  displayLocation,
  avatarUrl,
  isOwner,
  targetUserId,
  onEditIntroClick,
  resume,
  onResumeUpload,
  resumeUploading = false,
}: ProfileHeaderProps) {
  return (
    <div className="bg-[#1D2125] rounded-xl border border-[#292C30] shadow-lg overflow-hidden mb-4 relative">
      <div className="h-36 sm:h-44 bg-gradient-to-r from-[#0a0d14] via-[#171A1E] to-[#0073FF] relative">
        {isOwner && (
          <button
            onClick={onEditIntroClick}
            className="absolute top-3 right-3 p-2 rounded-full shadow text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold px-3 cursor-pointer"
            title="Edit Banner & Intro"
          />
        )}
      </div>

      <div className="px-6 pb-6 relative">
        <div className="absolute -top-16 left-6 z-10">
          <div className="relative">
            <CandidateAvatar
              avatarUrl={avatarUrl}
              name={displayName}
              size="xl"
              borderClassName="border-4 border-[#1D2125] shadow-md"
            />
            {isOwner && (
              <button
                onClick={onEditIntroClick}
                className="absolute bottom-1 right-1 bg-[#171A1E] rounded-full p-1.5 shadow border border-[#292C30] hover:bg-[#292C30] transition-colors cursor-pointer"
                title="Edit Photo"
              >
                <Camera size={13} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>

        <div className="pt-20 sm:pt-16 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{displayName}</h1>
              <CheckCircle size={20} className="text-[#00B5ED] fill-[#0073FF]/20" />
              {isOwner && (
                <button
                  onClick={onEditIntroClick}
                  className="text-gray-400 hover:text-[#00B5ED] transition-colors p-1 rounded-full hover:bg-[#171A1E] cursor-pointer ml-1"
                  title="Edit Intro"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
            {displayHeadline && (
              <p className="text-sm sm:text-base text-gray-400 font-medium mt-1 max-w-2xl leading-relaxed">
                {displayHeadline}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mt-2 flex-wrap">
              {displayCompany && <span className="font-semibold text-[#CCCCCC]">{displayCompany}</span>}
              {displayCompany && displayEducation && <span>•</span>}
              {displayEducation && <span>{displayEducation}</span>}
              {(displayCompany || displayEducation) && displayLocation && <span>•</span>}
              {displayLocation && (
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-gray-500" />
                  {displayLocation}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start flex-wrap mt-2 md:mt-0">
            {isOwner ? (
              <>
                <button
                  onClick={onEditIntroClick}
                  className="bg-[#0073FF] hover:bg-[#0060D0] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil size={15} />
                  Edit Profile
                </button>

                <label className="border border-[#0073FF] text-[#00B5ED] hover:bg-[#0073FF]/10 px-4 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
                  {resumeUploading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <FileUp size={16} />
                  )}
                  <span>{resume?.fileUrl ? "Update Resume" : "Upload Resume"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    disabled={resumeUploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && onResumeUpload) {
                        onResumeUpload(file);
                      }
                    }}
                  />
                </label>

                {resume?.fileUrl && (
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resume.fileName || "Resume.pdf"}
                    className="bg-[#0073FF]/10 hover:bg-[#0073FF]/20 text-[#00B5ED] border border-[#0073FF]/30 px-4 py-2 rounded-full font-semibold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Download Resume</span>
                  </a>
                )}
              </>
            ) : (
              <>
                {targetUserId ? (
                  <ConnectionButton userId={targetUserId} />
                ) : (
                  <button className="bg-[#0073FF] hover:bg-[#0060D0] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer">
                    <UserPlus size={16} />
                    Connect
                  </button>
                )}

                {resume?.fileUrl && (
                  <a
                    href={resume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resume.fileName || "Resume.pdf"}
                    className="border border-[#0073FF] text-[#00B5ED] hover:bg-[#0073FF]/10 px-4 py-2 rounded-full font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download size={16} />
                    <span>Download Resume</span>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

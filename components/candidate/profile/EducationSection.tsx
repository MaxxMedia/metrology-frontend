"use client";

import { GraduationCap, Pencil, Calendar } from "lucide-react";

type Education = {
  id: number;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number | string;
  endYear?: number | string;
  grade?: string;
  description?: string;
};

interface Props {
  editable?: boolean;
  education: Education[];
  onEditClick?: () => void;
}

export default function EducationSection({
  editable = false,
  education = [],
  onEditClick,
}: Props) {
  const eduList = Array.isArray(education) ? education : [];

  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
      {/* Show edit button when owner */}
      {(!editable && onEditClick) && (
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          title="Edit Education"
        >
          <Pencil size={16} />
        </button>
      )}

      {editable && (
        <button className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer">
          <Pencil size={16} />
        </button>
      )}

      <h2 className="text-lg font-bold text-white mb-5">Education</h2>

      {eduList.length === 0 ? (
        <p className="text-sm text-[#a1a1a1] italic">No education added yet.</p>
      ) : (
        <div className="space-y-5 divide-y divide-white/10">
          {eduList.map((item) => {
            const start = item.startYear ? String(item.startYear) : "";
            const end = item.endYear ? String(item.endYear) : "";
            const dateRange = start && end ? `${start} - ${end}` : start || end || "";

            return (
              <div key={item.id || Math.random()} className="flex gap-4 pt-5 first:pt-0">
                <div className="w-12 h-12 rounded-lg bg-[#0073ff]/10 text-[#0073ff] flex items-center justify-center shrink-0 border border-[#0073ff]/20">
                  <GraduationCap size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white leading-snug">
                    {item.institution}
                  </h3>

                  <p className="text-sm font-medium text-white mt-0.5">
                    {item.degree}
                    {item.fieldOfStudy && ` · ${item.fieldOfStudy}`}
                  </p>

                  {dateRange && (
                    <p className="text-xs text-[#a1a1a1] font-medium mt-1 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#0073ff]" />
                      <span>{dateRange}</span>
                    </p>
                  )}

                  {item.grade && (
                    <p className="text-xs text-[#a1a1a1] font-medium mt-1">
                      Grade / CGPA: <span className="text-white font-semibold">{item.grade}</span>
                    </p>
                  )}

                  {item.description && (
                    <p className="text-sm text-[#a1a1a1] leading-relaxed mt-2.5 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
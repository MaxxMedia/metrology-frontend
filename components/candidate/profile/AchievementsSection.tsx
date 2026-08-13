"use client";

import { Trophy, Pencil, Calendar } from "lucide-react";

type Achievement = {
  id: number;
  title: string;
  description?: string;
  issuer?: string;
  achievementDate?: string;
};

interface Props {
  editable?: boolean;
  achievements: Achievement[];
  onEditClick?: () => void;
}

export default function AchievementsSection({
  editable = false,
  achievements = [],
  onEditClick,
}: Props) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const clean = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
      const [y, m] = clean.split("-");
      if (y && m) {
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
      }
      return clean;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
      {(!editable && onEditClick) && (
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          title="Edit Accomplishments"
        >
          <Pencil size={16} />
        </button>
      )}

      {editable && (
        <button className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer">
          <Pencil size={16} />
        </button>
      )}

      <h2 className="text-lg font-bold text-white mb-5">
        Accomplishments
      </h2>

      {achievements.length === 0 ? (
        <p className="text-sm text-[#a1a1a1] italic">
          No accomplishments added yet.
        </p>
      ) : (
        <div className="space-y-5 divide-y divide-white/10">
          {achievements.map((achievement) => {
            const formattedDate = formatDate(achievement.achievementDate);

            const issuer = achievement.issuer || (achievement as any).organization || "";

            return (
              <div
                key={achievement.id || Math.random()}
                className="flex gap-4 pt-5 first:pt-0"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0073ff]/10 text-[#0073ff] flex items-center justify-center shrink-0 border border-[#0073ff]/20">
                  <Trophy size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white leading-snug">
                    {achievement.title}
                  </h3>

                  {issuer && (
                    <p className="text-sm font-medium text-white mt-0.5">
                      {issuer}
                    </p>
                  )}

                  {formattedDate && (
                    <p className="text-xs text-[#a1a1a1] font-medium mt-1 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#0073ff]" />
                      <span>{formattedDate}</span>
                    </p>
                  )}

                  {achievement.description && (
                    <p className="text-sm text-[#a1a1a1] leading-relaxed mt-2.5 whitespace-pre-line">
                      {achievement.description}
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
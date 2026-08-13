"use client";

import { Pencil } from "lucide-react";

type Skill = {
  id: number;
  name: string;
  level?: string;
  endorsementsCount?: number;
};

interface SkillsSectionProps {
  editable?: boolean;
  skills: Skill[];
  onEditClick?: () => void;
}

export default function SkillsSection({
  editable = false,
  skills = [],
  onEditClick,
}: SkillsSectionProps) {
  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">
          Skills {skills.length > 0 && <span className="text-[#a1a1a1] font-normal">({skills.length})</span>}
        </h2>

        {(!editable && onEditClick) && (
          <button
            onClick={onEditClick}
            title="Edit Skills"
            className="text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Pencil size={16} />
          </button>
        )}

        {editable && (
          <button
            className="text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          >
            <Pencil size={16} />
          </button>
        )}
      </div>

      {/* Empty */}
      {skills.length === 0 ? (
        <p className="text-sm text-[#a1a1a1] italic">No skills added yet.</p>
      ) : (
        /* Horizontal Skills Layout */
        <div className="flex flex-wrap gap-2.5">
          {skills.map((skill) => (
            <div
              key={skill.id || Math.random()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-[#171A1E] hover:border-[#0073ff] hover:bg-[#0073ff]/5 transition-all shadow-2xs group"
            >
              <span className="font-bold text-sm text-white">{skill.name}</span>
              {skill.level && (
                <span className="text-xs text-[#a1a1a1] bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                  {skill.level}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
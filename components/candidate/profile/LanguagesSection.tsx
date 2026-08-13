"use client";

import { Pencil } from "lucide-react";

type Language = {
  id: number;
  language: string;
  proficiency?: string;
};

interface Props {
  editable?: boolean;
  languages: Language[];
  onEditClick?: () => void;
}

export default function LanguagesSection({
  editable = false,
  languages = [],
  onEditClick,
}: Props) {
  return (
    <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">
          Languages {languages.length > 0 && <span className="text-[#a1a1a1] font-normal">({languages.length})</span>}
        </h2>

        {(!editable && onEditClick) && (
          <button
            onClick={onEditClick}
            title="Edit Languages"
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

      {languages.length === 0 ? (
        <p className="text-sm text-[#a1a1a1] italic">No languages added.</p>
      ) : (
        /* Horizontal Languages Layout */
        <div className="flex flex-wrap gap-2.5">
          {languages.map((lang) => (
            <div
              key={lang.id || Math.random()}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-[#171A1E] hover:border-[#0073ff] hover:bg-[#0073ff]/5 transition-all shadow-2xs"
            >
              <span className="font-bold text-sm text-white">{lang.language}</span>
              {lang.proficiency && (
                <span className="text-xs text-[#a1a1a1] bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                  {lang.proficiency}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
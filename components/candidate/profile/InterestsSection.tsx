"use client";

import { Heart, Pencil } from "lucide-react";

type Interest = {
    id: number;
    name: string;
    category?: string;
    followersCount?: number;
    imageUrl?: string;
};

interface Props {
    editable?: boolean;
    interests: Interest[];
    onEditClick?: () => void; // Add this
}

export default function InterestsSection({
    editable = false,
    interests,
    onEditClick, // Add this
}: Props) {
    return (
        <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
            {/* Show edit button when not editable */}
            {!editable && onEditClick && (
                <button
                    onClick={onEditClick}
                    className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
                >
                    <Pencil size={16} />
                </button>
            )}

            {editable && (
                <button className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer">
                    <Pencil size={16} />
                </button>
            )}

            <h2 className="text-lg font-semibold mb-5 text-white">Interests</h2>

            {interests.length === 0 ? (
                <p className="text-sm text-[#a1a1a1]">No interests added.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {interests.map((interest) => {
                        const name = interest.name || (interest as any).title || (interest as any).interestName || "Interest";
                        const category = interest.category || (interest as any).type || "";

                        return (
                            <div
                                key={interest.id || Math.random()}
                                className="flex items-center gap-3 border border-white/10 rounded-xl p-4 hover:shadow-sm transition bg-[#171A1E]"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[#0073ff]/10 text-[#0073ff] flex items-center justify-center shrink-0 border border-[#0073ff]/20">
                                    <Heart size={18} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm text-white truncate">{name}</h3>
                                    {category && (
                                        <p className="text-xs text-[#a1a1a1] mt-0.5 truncate">{category}</p>
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
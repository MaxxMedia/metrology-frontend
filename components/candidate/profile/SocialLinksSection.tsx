"use client";

import {
    Globe,
    Linkedin,
    Github,
    Twitter,
    Instagram,
    ExternalLink,
    Pencil,
} from "lucide-react";

type Social = {
    id: number;
    platform: string;
    url: string;
    username?: string;
};

interface Props {
    socials: Social[];
    onEditClick?: () => void;
}

function getIcon(platform: string) {
    switch (platform.toLowerCase()) {
        case "linkedin":
            return <Linkedin size={18} />;
        case "github":
            return <Github size={18} />;
        case "twitter":
        case "x":
            return <Twitter size={18} />;
        case "instagram":
            return <Instagram size={18} />;
        default:
            return <Globe size={18} />;
    }
}

export default function SocialLinksSection({
    socials,
    onEditClick,
}: Props) {
    return (
        <div className="bg-[#121213] rounded-xl border border-white/10 p-6 shadow-sm relative">
            {onEditClick && (
                <button
                    onClick={onEditClick}
                    className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
                    title="Edit Contact & Social Links"
                >
                    <Pencil size={16} />
                </button>
            )}

            <h3 className="text-base font-semibold mb-5 text-white">
                Contact & Social Links
            </h3>

            {socials.length === 0 ? (
                <p className="text-sm text-[#a1a1a1]">
                    No social links added.
                </p>
            ) : (
                <div className="space-y-4">

                    {socials.map((social) => (

                        <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between hover:bg-white/5 rounded-lg p-2 transition"
                        >

                            <div className="flex items-center gap-3">

                                <div className="w-9 h-9 rounded-full bg-[#0073ff]/10 flex items-center justify-center text-[#0073ff]">

                                    {getIcon(social.platform)}

                                </div>

                                <div>

                                    <p className="font-medium text-white">
                                        {social.platform}
                                    </p>

                                    <p className="text-xs text-[#a1a1a1]">
                                        {social.username ?? social.url}
                                    </p>

                                </div>

                            </div>

                            <ExternalLink
                                size={16}
                                className="text-[#a1a1a1]"
                            />

                        </a>

                    ))}

                </div>
            )}

        </div>
    );
}
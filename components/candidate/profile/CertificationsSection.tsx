"use client";

import { Award, ExternalLink, Pencil, Calendar } from "lucide-react";

type Certification = {
  id: number;
  name?: string;
  title?: string;
  issuingOrganization?: string;
  issuer?: string;
  issueDate?: string;
  startDate?: string;
  expirationDate?: string;
  endDate?: string;
  credentialId?: string;
  licenseNumber?: string;
  credentialUrl?: string;
  url?: string;
};

interface Props {
  editable?: boolean;
  certifications: Certification[];
  onEditClick?: () => void;
}

export default function CertificationsSection({
  editable = false,
  certifications = [],
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
      {/* Edit Icon Header */}
      {(!editable && onEditClick) && (
        <button
          onClick={onEditClick}
          className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          title="Edit Certifications"
        >
          <Pencil size={16} />
        </button>
      )}

      {editable && (
        <button className="absolute top-4 right-4 text-[#a1a1a1] hover:text-[#0073ff] transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer">
          <Pencil size={16} />
        </button>
      )}

      <h2 className="text-lg font-bold text-white mb-5">Licenses & Certifications</h2>

      {certifications.length === 0 ? (
        <p className="text-sm text-[#a1a1a1] italic">No licenses or certifications added yet.</p>
      ) : (
        <div className="space-y-5 divide-y divide-white/10">
          {certifications.map((cert) => {
            const certTitle = cert.name || cert.title || "Certification";
            const certIssuer = cert.issuingOrganization || cert.issuer || (cert as any).organization || (cert as any).authority || "";
            const issueDateRaw = cert.issueDate || cert.startDate;
            const expDateRaw = cert.expirationDate || cert.endDate || (cert as any).expiryDate;
            const credId = cert.credentialId || cert.licenseNumber;
            const credUrl = cert.credentialUrl || cert.url;

            const issueFormatted = formatDate(issueDateRaw);
            const expFormatted = expDateRaw ? formatDate(expDateRaw) : "";

            let dateLine = "";
            if (issueFormatted && expFormatted) {
              dateLine = `Issued ${issueFormatted} · Expires ${expFormatted}`;
            } else if (issueFormatted) {
              dateLine = `Issued ${issueFormatted} · No Expiration Date`;
            }

            return (
              <div
                key={cert.id || Math.random()}
                className="flex gap-4 pt-5 first:pt-0"
              >
                <div className="w-12 h-12 rounded-lg bg-[#0073ff]/10 text-[#0073ff] flex items-center justify-center shrink-0 border border-[#0073ff]/20">
                  <Award size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white leading-snug">
                    {certTitle}
                  </h3>

                  {certIssuer && (
                    <p className="text-sm font-medium text-white mt-0.5">
                      {certIssuer}
                    </p>
                  )}

                  {dateLine && (
                    <p className="text-xs text-[#a1a1a1] font-medium mt-1 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#0073ff]" />
                      <span>{dateLine}</span>
                    </p>
                  )}

                  {credId && (
                    <p className="text-xs text-[#a1a1a1] mt-1 font-mono">
                      Credential ID: <span className="text-white font-semibold">{credId}</span>
                    </p>
                  )}

                  {credUrl && (
                    <div className="mt-2.5">
                      <a
                        href={credUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0073ff] hover:underline bg-[#0073ff]/5 px-3.5 py-1.5 rounded-full border border-[#0073ff]/20 transition-colors"
                      >
                        <span>Show credential</span>
                        <ExternalLink size={13} />
                      </a>
                    </div>
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
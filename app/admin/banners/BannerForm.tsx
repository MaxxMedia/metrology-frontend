"use client";
/** Implements the admin banners banner form interface and its related behavior. */


import { useState, useEffect } from "react";
import { BANNER_PLACEMENTS } from "@/lib/bannerPlacements";

type BannerPlacement = (typeof BANNER_PLACEMENTS)[number]["value"];

type BannerFormProps = {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
};

const DEFAULT_BANNER_PLACEMENT = BANNER_PLACEMENTS[0].value as BannerPlacement;

/** Builds the banner placement value used by the surrounding workflow. */
function resolveBannerPlacement(value?: string): BannerPlacement {
  return (
    BANNER_PLACEMENTS.find((placement) => placement.value === value)?.value ??
    DEFAULT_BANNER_PLACEMENT
  );
}

/** Renders the banner form interface. */
export default function BannerForm({
  initialData,
  onSubmit,
}: BannerFormProps) {
  const [title, setTitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");

  const [placement, setPlacement] = useState<BannerPlacement>(
    DEFAULT_BANNER_PLACEMENT
  );

  const selectedPlacement =
    BANNER_PLACEMENTS.find((p) => p.value === placement) ?? BANNER_PLACEMENTS[0];

  const [status, setStatus] = useState("ACTIVE");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!initialData) return;

    setTitle(initialData.title ?? "");
    setTargetUrl(initialData.targetUrl ?? "");
    setPlacement(resolveBannerPlacement(initialData.placement));
    setStatus(initialData.status ?? "ACTIVE");
    setImageUrl(initialData.imageUrl ?? "");
  }, [initialData]);

  /** Uploads the image asset and returns its result to the form. */
  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!res.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await res.json();
      if (!data.imageUrl) {
        throw new Error(data.message || "No image URL returned");
      }
      setImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  /** Handles the submit interaction and its related state changes. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert("Please upload an image for the banner");
      return;
    }
    setLoading(true);

    try {
      await onSubmit({
        title,
        imageUrl,
        targetUrl,
        placement,
        status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl text-slate-800">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Banner Title *</label>
        <input
          className="w-full bg-white text-slate-900 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ff] focus:border-transparent transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Precision CMM Promo"
          required
        />
      </div>

      {/* Redirect URL */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Redirect URL</label>
        <input
          className="w-full bg-white text-slate-900 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ff] focus:border-transparent transition"
          value={targetUrl}
          onChange={(e) => setTargetUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>

      {/* Placement */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Placement *</label>
        <select
          className="w-full bg-white text-slate-900 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ff] focus:border-transparent transition"
          value={placement}
          onChange={(e) =>
            setPlacement(e.target.value as BannerPlacement)
          }
        >
          {BANNER_PLACEMENTS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
        <select
          className="w-full bg-white text-slate-900 border border-slate-300 px-3.5 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0073ff] focus:border-transparent transition"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Image Upload */}
      <div>
        <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">{selectedPlacement.format} · {selectedPlacement.aspectRatio}</p>
          <p>Standard size: <strong>{selectedPlacement.standardSize}</strong></p>
          <p>Recommended upload (2× Retina, no blur): <strong>{selectedPlacement.retinaSize}</strong></p>
        </div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Banner Image *</label>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
          className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-[#0073ff] hover:file:bg-blue-100 cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) uploadImage(file);
          }}
        />

        {uploading && (
          <p className="mt-2 text-xs text-[#0073ff] font-medium flex items-center gap-1.5">
            <span className="inline-block w-3.5 h-3.5 border-2 border-[#0073ff] border-t-transparent rounded-full animate-spin" />
            Uploading image...
          </p>
        )}

        {uploadError && (
          <p className="mt-2 text-xs text-red-500 font-medium">
            {uploadError}
          </p>
        )}

        {imageUrl && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1 font-medium">Preview:</p>
            <img
              src={imageUrl}
              alt="Banner Preview"
              className="w-full max-h-[220px] object-contain rounded-lg border border-slate-200 bg-slate-50 p-1 shadow-sm"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={!imageUrl || loading || uploading}
          className="inline-flex items-center justify-center bg-[#0073ff] hover:bg-[#0060d6] text-white text-sm font-semibold px-6 py-2.5 rounded-lg disabled:opacity-50 transition shadow-sm"
        >
          {loading ? "Saving..." : "Save Banner"}
        </button>
      </div>
    </form>
  );
}


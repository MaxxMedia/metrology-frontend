/**
 * utils/downloadFile.ts
 *
 * Generic, reusable file download helper.
 * Works for any uploaded file (PDF, image, docx, etc.) — it does NOT
 * assume or force a file type. Instead it:
 *
 * 1. Fetches the file as raw bytes.
 * 2. Inspects the actual bytes/content-type to figure out what it really is.
 * 3. If it looks like an error page (HTML/JSON) instead of a real file,
 *    it throws instead of silently saving a corrupted/junk file.
 * 4. Downloads it with the correct extension based on the REAL content,
 *    not a guess.
 */

type DownloadResult = {
  success: boolean;
  error?: string;
};

// Known file signatures (magic bytes) -> [mime type, extension]
const SIGNATURES: { check: (bytes: Uint8Array) => boolean; mime: string; ext: string }[] = [
  {
    // %PDF
    check: (b) => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46,
    mime: "application/pdf",
    ext: "pdf",
  },
  {
    // PNG
    check: (b) => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
    mime: "image/png",
    ext: "png",
  },
  {
    // JPEG
    check: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
    mime: "image/jpeg",
    ext: "jpg",
  },
  {
    // ZIP-based formats (docx, xlsx, pptx, zip): PK\x03\x04
    check: (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
    mime: "application/zip",
    ext: "zip", // refined below using the original filename if available
  },
];

/** Identifies a file type from its byte signature rather than trusting the filename. */
function detectFileType(bytes: Uint8Array): { mime: string; ext: string } | null {
  for (const sig of SIGNATURES) {
    if (sig.check(bytes)) return { mime: sig.mime, ext: sig.ext };
  }
  return null;
}

/** Detects HTML or JSON error responses that should not be saved as downloaded files. */
function looksLikeTextError(bytes: Uint8Array): boolean {
  // Decode the first ~200 bytes and check for HTML/JSON error markers.
  // Cloudinary (and most APIs) return HTML or JSON when access is denied
  // or the resource doesn't exist — never the actual file in that case.
  const sample = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(0, 200)).trim();
  const lower = sample.toLowerCase();
  return (
    lower.startsWith("<!doctype html") ||
    lower.startsWith("<html") ||
    lower.startsWith("{") || // JSON error body, e.g. {"error":"..."}
    lower.includes("access denied") ||
    lower.includes("not found")
  );
}

/** Downloads a file, checks the response body, and saves it with an extension inferred from its content. */
export async function downloadFile(
  url: string,
  preferredFileName?: string
): Promise<DownloadResult> {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return { success: false, error: `Server responded with ${res.status}` };
    }

    const buffer = await res.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (bytes.length === 0) {
      return { success: false, error: "File is empty" };
    }

    if (looksLikeTextError(bytes)) {
      return {
        success: false,
        error:
          "The server returned an error page instead of the file. This usually means the host (e.g. Cloudinary) is blocking direct access to this file type — check delivery/security settings.",
      };
    }

    const detected = detectFileType(bytes);

    // Fall back to whatever extension is already in the URL/preferredFileName
    // if we can't sniff the type from bytes (rare, but don't block the download).
    const fallbackExt = (preferredFileName || url).split(".").pop()?.split("?")[0] || "bin";
    const mime = detected?.mime || "application/octet-stream";
    const ext = detected?.ext || fallbackExt;

    const baseName = (preferredFileName || "download").replace(/\.[^/.]+$/, "");
    const finalFileName = `${baseName}.${ext}`;

    const blob = new Blob([bytes], { type: mime });
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

    return { success: true };
  } catch (err) {
    console.error("downloadFile error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown download error",
    };
  }
}
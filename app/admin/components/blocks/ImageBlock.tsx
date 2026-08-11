// app/admin/components/blocks/ImageBlock.tsx
"use client";

import UploadBox from "@/components/UploadBox";
import { ImageBlock } from "../types";

interface Props {
  block: ImageBlock;
  onChange: (block: ImageBlock) => void;
}

export default function ImageBlockEditor({ block, onChange }: Props) {
  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok && data.imageUrl) {
      onChange({
        ...block,
        imageUrl: data.imageUrl,
      });
    } else {
      alert("Image upload failed");
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Image Block</h3>

      <UploadBox
        label="Upload Image"
        value={block.imageUrl}
        onUpload={handleUpload}
        accept="image/*"
        height="h-48"
        uploadType="image"
      />

      <input
        type="text"
        placeholder="Caption (optional)"
        value={block.caption || ""}
        onChange={(e) =>
          onChange({
            ...block,
            caption: e.target.value,
          })
        }
        className="w-full border rounded-lg p-2"
      />

      <input
        type="text"
        placeholder="Alt text (optional)"
        value={block.alt || ""}
        onChange={(e) =>
          onChange({
            ...block,
            alt: e.target.value,
          })
        }
        className="w-full border rounded-lg p-2"
      />
    </div>
  );
}
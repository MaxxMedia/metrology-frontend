// app/admin/components/blocks/GalleryBlock.tsx
"use client";

import UploadBox from "@/components/UploadBox";
import { GalleryBlock } from "../types";

interface Props {
  block: GalleryBlock;
  onChange: (block: GalleryBlock) => void;
}

export default function GalleryBlockEditor({ block, onChange }: Props) {
  async function uploadImage(file: File) {
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
        images: [...block.images, data.imageUrl],
      });
    } else {
      alert("Image upload failed");
    }
  }

  function removeImage(index: number) {
    onChange({
      ...block,
      images: block.images.filter((_, i) => i !== index),
    });
  }

  return (
    <div className="space-y-5">
      <h3 className="font-semibold text-lg">Gallery Block</h3>

      <div>
        <label className="block mb-2">Columns</label>
        <select
          value={block.columns || 3}
          onChange={(e) =>
            onChange({
              ...block,
              columns: Number(e.target.value) as 2 | 3 | 4,
            })
          }
          className="border rounded-lg p-2"
        >
          <option value={2}>2 Columns</option>
          <option value={3}>3 Columns</option>
          <option value={4}>4 Columns</option>
        </select>
      </div>

      <UploadBox
        label="Add Gallery Image"
        value=""
        onUpload={uploadImage}
        accept="image/*"
        height="h-32"
        uploadType="image"
      />

      {block.images.length > 0 && (
        <div
          className={`grid gap-4 ${
            block.columns === 2
              ? "grid-cols-2"
              : block.columns === 3
              ? "grid-cols-3"
              : "grid-cols-4"
          }`}
        >
          {block.images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Gallery image ${index + 1}`}
                className="rounded-lg border w-full h-40 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
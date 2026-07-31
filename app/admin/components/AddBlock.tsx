// app/admin/components/AddBlock.tsx
"use client";

import { ContentBlock } from "./types";

interface Props {
  onAdd(block: ContentBlock): void;
}

export default function AddBlock({ onAdd }: Props) {
  function create(type: ContentBlock["type"]) {
    const id = crypto.randomUUID();

    switch (type) {
      case "paragraph":
        onAdd({
          id,
          type,
          content: "",
        });
        break;

      case "heading":
        onAdd({
          id,
          type,
          text: "",
          level: 2,
        });
        break;

      case "image":
        onAdd({
          id,
          type,
          imageUrl: "",
          caption: "",
          alt: "",
        });
        break;

      case "gallery":
        onAdd({
          id,
          type,
          images: [],
          columns: 3,
        });
        break;

      case "quote":
        onAdd({
          id,
          type,
          quote: "",
        });
        break;
    }
  }

  return (
    <div className="border rounded-xl p-5 bg-white">
      <h3 className="font-semibold mb-4">Add Block</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => create("paragraph")}
          className="border rounded-lg p-3 hover:bg-gray-100 transition"
        >
          📝 Paragraph
        </button>

        <button
          type="button"
          onClick={() => create("heading")}
          className="border rounded-lg p-3 hover:bg-gray-100 transition"
        >
          📌 Heading
        </button>

        <button
          type="button"
          onClick={() => create("image")}
          className="border rounded-lg p-3 hover:bg-gray-100 transition"
        >
          🖼️ Image
        </button>

        <button
          type="button"
          onClick={() => create("gallery")}
          className="border rounded-lg p-3 hover:bg-gray-100 transition"
        >
          🎨 Gallery
        </button>

        <button
          type="button"
          onClick={() => create("quote")}
          className="border rounded-lg p-3 hover:bg-gray-100 transition"
        >
          💬 Quote
        </button>
      </div>
    </div>
  );
}
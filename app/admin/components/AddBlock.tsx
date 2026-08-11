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
    <div className="border rounded-xl p-5 bg-white text-slate-900">
      <h3 className="font-semibold mb-4 text-slate-900">Add Block</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => create("paragraph")}
          className="border border-slate-200 rounded-lg p-3 text-slate-700 hover:bg-slate-50 hover:border-[#0073ff]/40 transition"
        >
          Paragraph
        </button>

        <button
          type="button"
          onClick={() => create("heading")}
          className="border border-slate-200 rounded-lg p-3 text-slate-700 hover:bg-slate-50 hover:border-[#0073ff]/40 transition"
        >
          Heading
        </button>

        <button
          type="button"
          onClick={() => create("image")}
          className="border border-slate-200 rounded-lg p-3 text-slate-700 hover:bg-slate-50 hover:border-[#0073ff]/40 transition"
        >
          Image
        </button>

        <button
          type="button"
          onClick={() => create("gallery")}
          className="border border-slate-200 rounded-lg p-3 text-slate-700 hover:bg-slate-50 hover:border-[#0073ff]/40 transition"
        >
          Gallery
        </button>

        <button
          type="button"
          onClick={() => create("quote")}
          className="border border-slate-200 rounded-lg p-3 text-slate-700 hover:bg-slate-50 hover:border-[#0073ff]/40 transition"
        >
          Quote
        </button>
      </div>
    </div>
  );
}
// app/admin/components/blocks/ParagraphBlock.tsx
"use client";
/** Implements the admin components blocks paragraph block interface and its related behavior. */


import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { ParagraphBlock } from "../types";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

interface Props {
  block: ParagraphBlock;
  onChange: (block: ParagraphBlock) => void;
}

/** Renders the paragraph block editor interface. */
export default function ParagraphBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-3">
      <label className="font-semibold text-sm">Paragraph</label>
      <ReactQuill
        theme="snow"
        value={block.content}
        onChange={(value) =>
          onChange({
            ...block,
            content: value,
          })
        }
        className="bg-white"
      />
    </div>
  );
}
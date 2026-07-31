// app/admin/components/blocks/ParagraphBlock.tsx
"use client";

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
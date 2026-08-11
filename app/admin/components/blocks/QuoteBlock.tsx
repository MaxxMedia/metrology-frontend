// app/admin/components/blocks/QuoteBlock.tsx
"use client";

import { QuoteBlock } from "../types";

interface Props {
  block: QuoteBlock;
  onChange: (block: QuoteBlock) => void;
}

export default function QuoteBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <label className="font-semibold">Quote</label>

      <textarea
        rows={5}
        value={block.quote}
        placeholder="Enter quote..."
        onChange={(e) =>
          onChange({
            ...block,
            quote: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3 italic"
      />
    </div>
  );
}
// app/admin/components/blocks/HeadingBlock.tsx
"use client";

import { HeadingBlock } from "../types";

interface Props {
  block: HeadingBlock;
  onChange: (block: HeadingBlock) => void;
}

export default function HeadingBlockEditor({ block, onChange }: Props) {
  return (
    <div className="space-y-4">
      <label className="font-semibold">Heading</label>

      <select
        value={block.level || 2}
        onChange={(e) =>
          onChange({
            ...block,
            level: Number(e.target.value) as 1 | 2 | 3,
          })
        }
        className="border rounded-lg p-2 mb-2"
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>

      <input
        type="text"
        value={block.text}
        placeholder="Enter heading..."
        onChange={(e) =>
          onChange({
            ...block,
            text: e.target.value,
          })
        }
        className="w-full border rounded-lg p-3 text-xl font-semibold"
      />
    </div>
  );
}
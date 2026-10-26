// app/admin/components/PostBuilder.tsx
"use client";
/** Implements the admin components post builder interface and its related behavior. */


import { useEffect, useState } from "react";
import AddBlock from "./AddBlock";
import {
  ContentBlock,
  ParagraphBlock,
  HeadingBlock,
  ImageBlock,
  GalleryBlock,
  QuoteBlock,
} from "./types";
import ParagraphBlockEditor from "./blocks/ParagraphBlock";
import HeadingBlockEditor from "./blocks/HeadingBlock";
import ImageBlockEditor from "./blocks/ImageBlock";
import GalleryBlockEditor from "./blocks/GalleryBlock";
import QuoteBlockEditor from "./blocks/QuoteBlock";

interface Props {
  value: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

/** Renders the post builder interface. */
export default function PostBuilder({ value, onChange }: Props) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(value || []);

  useEffect(() => {
    setBlocks(value || []);
  }, [value]);

  /** Updates the blocks record or interface state. */
  function updateBlocks(updated: ContentBlock[]) {
    setBlocks(updated);
    onChange(updated);
  }

  /** Creates the block record or interface element. */
  function addBlock(block: ContentBlock) {
    updateBlocks([...blocks, block]);
  }

  /** Updates the block record or interface state. */
  function updateBlock(id: string, updatedBlock: ContentBlock) {
    updateBlocks(
      blocks.map((block) => (block.id === id ? updatedBlock : block))
    );
  }

  /** Removes the block record or interface element. */
  function deleteBlock(id: string) {
    updateBlocks(blocks.filter((block) => block.id !== id));
  }

  /** Coordinates the move up behavior for this workflow. */
  function moveUp(index: number) {
    if (index === 0) return;
    const updated = [...blocks];
    [updated[index - 1], updated[index]] = [
      updated[index],
      updated[index - 1],
    ];
    updateBlocks(updated);
  }

  /** Coordinates the move down behavior for this workflow. */
  function moveDown(index: number) {
    if (index === blocks.length - 1) return;
    const updated = [...blocks];
    [updated[index], updated[index + 1]] = [
      updated[index + 1],
      updated[index],
    ];
    updateBlocks(updated);
  }

  return (
    <div className="space-y-6">
      <AddBlock onAdd={addBlock} />

      {blocks.map((block, index) => (
        <div
          key={block.id}
          className="border rounded-xl bg-white p-5 shadow-sm text-slate-900"
        >
          <div className="flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={() => moveUp(index)}
              className="border px-3 py-1 rounded hover:bg-gray-50 transition"
              disabled={index === 0}
            >
              ↑
            </button>

            <button
              type="button"
              onClick={() => moveDown(index)}
              className="border px-3 py-1 rounded hover:bg-gray-50 transition"
              disabled={index === blocks.length - 1}
            >
              ↓
            </button>

            <button
              type="button"
              onClick={() => deleteBlock(block.id)}
              className="border px-3 py-1 rounded text-red-600 hover:bg-red-50 transition"
            >
              ✕ Delete
            </button>
          </div>

          {block.type === "paragraph" && (
            <ParagraphBlockEditor
              block={block as ParagraphBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "heading" && (
            <HeadingBlockEditor
              block={block as HeadingBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "image" && (
            <ImageBlockEditor
              block={block as ImageBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "gallery" && (
            <GalleryBlockEditor
              block={block as GalleryBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}

          {block.type === "quote" && (
            <QuoteBlockEditor
              block={block as QuoteBlock}
              onChange={(b) => updateBlock(block.id, b)}
            />
          )}
        </div>
      ))}

      {blocks.length === 0 && (
        <div className="text-center py-12 text-gray-400 border-2 border-dashed rounded-xl">
          No blocks yet. Click "Add Block" to start building your post.
        </div>
      )}
    </div>
  );
}
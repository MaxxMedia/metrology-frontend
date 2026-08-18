// app/admin/components/post/BlockRenderer.tsx
"use client";

import { ContentBlock } from "../types";
import PostQuoteCard from "@/components/posts/PostQuoteCard";

type ImageBlock = Extract<ContentBlock, { type: "image" }>;

interface Props {
  blocks: ContentBlock[];
}

export default function BlockRenderer({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Group blocks for side-by-side images
  const groupedBlocks: ContentBlock[] = [];
  let i = 0;
  while (i < blocks.length) {
    const current = blocks[i];
    const next = blocks[i + 1];
    
    // If current and next are both images, group them
    if (current.type === 'image' && next?.type === 'image') {
      groupedBlocks.push({
        ...current,
        _pairedWith: next.id,
        _isPair: true
      } as any);
      i += 2;
    } else {
      groupedBlocks.push(current);
      i++;
    }
  }

  return (
    <div className="max-w-[900px] mx-auto">
      {groupedBlocks.map((block, index) => {
        // Check if this is a paired image
        if (block.type === 'image' && (block as any)._isPair) {
          const currentBlock = block as any;
          const nextBlock = blocks.find(
            (b): b is ImageBlock => b.type === 'image' && b.id === currentBlock._pairedWith
          );
          if (nextBlock) {
            return (
              <div key={`pair-${index}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <ImageBlockSmall key={currentBlock.id} block={currentBlock} />
                <ImageBlockSmall key={nextBlock.id} block={nextBlock} />
              </div>
            );
          }
        }
        
        // Render single blocks normally
        switch (block.type) {
          case "heading":
            return <HeadingBlock key={block.id} block={block} />;
          case "paragraph":
            return <ParagraphBlock key={block.id} block={block} />;
          case "image":
            return <ImageBlockLarge key={block.id} block={block} />;
          case "gallery":
            return <GalleryBlock key={block.id} block={block} />;
          case "quote":
            return <QuoteBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

// ============= SUB-COMPONENTS =============

interface HeadingBlockProps {
  block: {
    level?: 1 | 2 | 3;
    text: string;
  };
}

function HeadingBlock({ block }: HeadingBlockProps) {
  const level = block.level || 2;
  const sizeMap: Record<number, string> = {
    1: "text-5xl font-bold",
    2: "text-4xl font-bold",
    3: "text-3xl font-bold",
  };
  const size = sizeMap[level] || sizeMap[2];

  switch (level) {
    case 1:
      return <h1 className={`${size} mb-3 text-white`}>{block.text}</h1>;
    case 2:
      return <h2 className={`${size} mb-3 text-white`}>{block.text}</h2>;
    case 3:
      return <h3 className={`${size} mb-3 text-white`}>{block.text}</h3>;
    default:
      return <h2 className={`${size} mb-3 text-white`}>{block.text}</h2>;
  }
}

interface ParagraphBlockProps {
  block: {
    content: string;
  };
}

function ParagraphBlock({ block }: ParagraphBlockProps) {
  return (
    <div
      className="prose prose-lg prose-invert max-w-none mb-6 text-gray-300 prose-headings:text-white prose-strong:text-white prose-a:text-blue-400"
      dangerouslySetInnerHTML={{ __html: block.content }}
    />
  );
}

// LARGE IMAGE - Standalone (Full width)
interface ImageBlockLargeProps {
  block: {
    id: string;
    imageUrl: string;
    alt?: string;
    caption?: string;
  };
}

function ImageBlockLarge({ block }: ImageBlockLargeProps) {
  return (
    <figure className="space-y-2 mb-6">
      <div className="relative w-full">
        <img
          src={block.imageUrl}
          alt={block.alt || ""}
          className="rounded-xl w-full h-auto object-cover"
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxWidth: '100%' 
          }}
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-gray-500 text-sm italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

// SMALL IMAGE - For paired images (Side-by-side)
interface ImageBlockSmallProps {
  block: {
    id: string;
    imageUrl: string;
    alt?: string;
    caption?: string;
  };
}

function ImageBlockSmall({ block }: ImageBlockSmallProps) {
  return (
    <figure className="space-y-2">
      <div className="relative w-full">
        <img
          src={block.imageUrl}
          alt={block.alt || ""}
          className="rounded-xl w-full h-auto object-cover"
          style={{ 
            width: '100%', 
            height: 'auto', 
            maxWidth: '100%' 
          }}
        />
      </div>
      {block.caption && (
        <figcaption className="text-center text-gray-500 text-sm italic">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}

interface GalleryBlockProps {
  block: {
    images: string[];
    columns?: 2 | 3 | 4;
  };
}

function GalleryBlock({ block }: GalleryBlockProps) {
  const images = block.images || [];
  const count = images.length;
  const isTwoPhotos = count === 2;

  const columns = block.columns || (isTwoPhotos ? 2 : 3);
  const colsMap: Record<number, string> = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
  };
  const cols = colsMap[columns] || colsMap[3];

  return (
    <div className={`grid ${cols} gap-4 md:gap-6 mb-8`}>
      {images.map((image: string, index: number) => (
        <div key={index} className="relative w-full overflow-hidden rounded-xl">
          <img
            src={image}
            alt={`Gallery image ${index + 1}`}
            className={`w-full ${
              isTwoPhotos ? "h-80 md:h-[420px]" : "h-48 md:h-56"
            } object-cover rounded-xl shadow-md transition-transform duration-300 hover:scale-105`}
          />
        </div>
      ))}
    </div>
  );
}

interface QuoteBlockProps {
  block: {
    quote: string;
    author?: string;
  };
}

function QuoteBlock({ block }: QuoteBlockProps) {
  return <PostQuoteCard quote={block.quote} author={block.author} />;
}
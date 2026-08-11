// app/admin/components/types.ts
export type BlockType =
  | "paragraph"
  | "heading"
  | "image"
  | "gallery"
  | "quote";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: "paragraph";
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: "heading";
  text: string;
  level: 1 | 2 | 3;
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  imageUrl: string;
  caption?: string;
  alt?: string;
}

export interface GalleryBlock extends BaseBlock {
  type: "gallery";
  images: string[];
  columns: 2 | 3 | 4;
}

export interface QuoteBlock extends BaseBlock {
  type: "quote";
  quote: string;
}

export type ContentBlock =
  | ParagraphBlock
  | HeadingBlock
  | ImageBlock
  | GalleryBlock
  | QuoteBlock;
"use client";

interface PostQuoteCardProps {
  quote: string;
  author?: string;
  className?: string;
}

export default function PostQuoteCard({
  quote,
  author,
  className = "",
}: PostQuoteCardProps) {
  if (!quote) return null;

  return (
    <div
      className={`my-8 w-full rounded-2xl bg-[#16181D] px-6 py-8 md:px-12 md:py-10 border border-[#23262D]/60 flex flex-col items-center justify-center text-center shadow-lg transition-all ${className}`}
    >
      {/* Quotation Mark Icon */}
      <div className="mb-5 flex items-center justify-center">
        <svg
          className="w-9 h-9 md:w-11 md:h-11 text-white fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Quote Text */}
      <p className="text-gray-100 text-base md:text-lg lg:text-[19px] font-normal leading-relaxed max-w-4xl mx-auto">
        {quote}
      </p>

      {/* Author Attribution */}
      {author && (
        <p className="mt-5 text-sm md:text-base font-medium text-gray-300">
          - {author}
        </p>
      )}
    </div>
  );
}

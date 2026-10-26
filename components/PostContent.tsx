/** Implements the post content component and its related interface behavior. */
import DOMPurify from "isomorphic-dompurify"

/** Renders the post content interface. */
export default function PostContent({ content }: { content: string }) {
  return (
    <article
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  )
}

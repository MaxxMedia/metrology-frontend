"use client"
/** Implements the social links tracker component and its related interface behavior. */


/** Renders the social links tracker interface. */
export default function SocialLinksTracker({
  supplierId,
  children,
}: {
  supplierId: number
  children: React.ReactNode
}) {
  /** Coordinates the track behavior for this component. */
  const track = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${supplierId}/connection`,
        { method: "POST" }
      )
    } catch (err) {
      console.error("Failed to track connection", err)
    }
  }

  return (
    <div
      onClick={track}
      className="inline-flex"
    >
      {children}
    </div>
  )
}

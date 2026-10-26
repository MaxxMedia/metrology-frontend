'use client'
/** Provides the reusable aspect ratio UI primitive and its interaction behavior. */


import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

/** Renders the aspect ratio interface. */
function AspectRatio({
  ...props
}: React.ComponentProps<typeof AspectRatioPrimitive.Root>) {
  return <AspectRatioPrimitive.Root data-slot="aspect-ratio" {...props} />
}

export { AspectRatio }

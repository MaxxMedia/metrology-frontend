/** Provides the reusable spinner UI primitive and its interaction behavior. */
import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Renders the spinner interface. */
function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }

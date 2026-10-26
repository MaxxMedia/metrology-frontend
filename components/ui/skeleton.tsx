/** Provides the reusable skeleton UI primitive and its interaction behavior. */
import { cn } from '@/lib/utils'

/** Renders the skeleton interface. */
function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('bg-accent animate-pulse rounded-md', className)}
      {...props}
    />
  )
}

export { Skeleton }

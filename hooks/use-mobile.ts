/** Client hook for responsive layout decisions based on the shared mobile breakpoint. */
import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/** Tracks whether the viewport is narrower than the shared mobile breakpoint. */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Keep the initial value undefined for server rendering, then synchronize and subscribe in the browser.
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    /** Updates mobile state whenever the media query changes. */
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    // Remove the media-query listener when the component using this hook unmounts.
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

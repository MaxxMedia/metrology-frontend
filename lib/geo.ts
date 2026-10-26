/** Provides shared geo utilities for the frontend. */
type GeoModule = typeof import("country-state-city")

let geoModule: GeoModule | null = null

/** Loads the visitor?s geographic information for the location-aware UI. */
export async function loadGeo(): Promise<GeoModule> {
  if (!geoModule) {
    geoModule = await import("country-state-city")
  }
  return geoModule
}

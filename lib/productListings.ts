/** Normalizes supplier product data and counts usable product entries. */
/** Converts stored product data into a consistent string list, including JSON-encoded values. */
export function normalizeProductSupplies(
  productSupplies: unknown
): string[] {
  if (!productSupplies) return []
  if (typeof productSupplies === "string") {
    try {
      return normalizeProductSupplies(JSON.parse(productSupplies))
    } catch {
      return []
    }
  }
  if (!Array.isArray(productSupplies)) return []
  return productSupplies.map((item) => {
    if (typeof item === "string") return item
    if (item && typeof item === "object" && "name" in item) {
      return String((item as { name?: string }).name ?? "")
    }
    return String(item ?? "")
  })
}

/** Counts non-empty product entries after normalizing the supplied product data. */
export function countFilledProducts(productSupplies: unknown = []) {
  return normalizeProductSupplies(productSupplies).filter(
    (item) => item.trim().length > 0
  ).length
}

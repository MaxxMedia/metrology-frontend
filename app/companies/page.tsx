/** Implements the companies page and its route-specific behavior. */
import { redirect } from "next/navigation"

/** Renders the companies page interface. */
export default function CompaniesPage() {
  redirect("/suppliers")
}

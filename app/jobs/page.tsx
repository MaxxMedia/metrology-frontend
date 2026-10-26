/** Implements the jobs page and its route-specific behavior. */
import { redirect } from "next/navigation";

/** Renders the jobs page interface. */
export default function JobsPage() {
  redirect("/feed");
}
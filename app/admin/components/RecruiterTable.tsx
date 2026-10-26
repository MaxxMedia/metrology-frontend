/** Implements the admin components recruiter table interface and its related behavior. */
import type { Company, Recruiter, Directory } from "@/types/admin"

/** Renders the recruiter table interface. */
export default function RecruiterTable({
  recruiters = [],
}: {
  recruiters?: Recruiter[]
}) {
  if (!Array.isArray(recruiters)) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left">
            <th className="py-3 px-3">Username</th>
            <th className="px-3">Email</th>
            <th className="px-3">Company</th>
            <th className="px-3">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {recruiters.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="py-6 text-center text-gray-500"
              >
                No recruiters found
              </td>
            </tr>
          )}

          {recruiters.map((r) => (
            <tr key={r.id} className="hover:bg-gray-50">
              <td className="py-3 px-3 font-medium">
                {r.username}
              </td>

              <td className="px-3 text-gray-600">
                {r.email}
              </td>

              <td className="px-3">
                {r.company?.name || "—"}
              </td>

              <td className="px-3 text-xs text-gray-500">
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

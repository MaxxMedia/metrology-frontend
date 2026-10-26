/** Implements the admin components directory table interface and its related behavior. */
import type { Company, Recruiter, Directory } from "@/types/admin"


/** Renders the directory table interface. */
export default function DirectoryTable({
  directories = [],
}: {
  directories?: Directory[]
}) {
  if (!Array.isArray(directories)) {
    return null
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b bg-gray-50">
          <tr className="text-left">
            <th className="py-3 px-3">Directory</th>
            <th className="px-3">Company</th>
            <th className="px-3">Recruiter</th>
            <th className="px-3">Status</th>
            <th className="px-3">Created</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {directories.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="py-6 text-center text-gray-500"
              >
                No directories found
              </td>
            </tr>
          )}

          {directories.map((d) => (
            <tr key={d.id} className="hover:bg-gray-50">
              <td className="py-3 px-3 font-medium">
                {d.name}
                {d.slug && (
                  <div className="text-xs text-gray-400">
                    /suppliers/{d.slug}
                  </div>
                )}
              </td>

              <td className="px-3">
                {d.company?.name || "—"}
              </td>

              <td className="px-3">
                {d.submittedBy?.username || "—"}
              </td>

              <td className="px-3">
                {d.status ? (
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      d.status === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : d.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {d.status}
                  </span>
                ) : (
                  "—"
                )}
              </td>

              <td className="px-3 text-xs text-gray-500">
                {new Date(d.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

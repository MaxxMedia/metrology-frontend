/** Implements the admin components company table interface and its related behavior. */
import type { Company } from "@/types/admin"

/** Renders the company table interface. */
export default function CompanyTable({
  companies,
}: {
  companies: Company[]
}) {
  return (
    <table className="w-full text-sm">
      <thead className="border-b">
        <tr className="text-left">
          <th className="py-3 px-3">ID</th>
          <th className="px-3">Company</th>
          <th className="px-3">Status</th>
          <th className="px-3">Created</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {companies.map((company) => (
          <tr key={company.id} className="hover:bg-gray-50">
            
            {/* ✅ Company ID */}
            <td className="py-3 px-3 font-mono text-gray-600">
              {company.id}
            </td>

            <td className="px-3 font-medium">
              {company.name}
              <div className="text-xs text-gray-400">
                /companies/{company.slug}
              </div>
            </td>

            <td className="px-3">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  company.isVerified
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {company.isVerified ? "Verified" : "Pending"}
              </span>
            </td>

            <td className="px-3 text-xs text-gray-500">
              {new Date(company.createdAt).toLocaleDateString()}
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  )
}

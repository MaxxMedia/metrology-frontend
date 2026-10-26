"use client"
/** Implements the admin events id registrations page and its route-specific behavior. */


import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

type Registration = {
  id: number
  fullName: string
  email: string
  phone: string
  companyName?: string
  jobTitle?: string
  country?: string
  createdAt: string
}

/** Renders the event registrations page interface. */
export default function EventRegistrationsPage() {
  const { id } = useParams()
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    /** Loads data for the current workflow. */
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/events/admin/${id}/registrations`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )

        const data = await res.json()
        setRegistrations(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-8 bg-[#F4F6FA] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Event Registrations</h1>

      {registrations.length === 0 ? (
        <p>No registrations yet.</p>
      ) : (
        <table className="w-full bg-white rounded-xl shadow border text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Job Title</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {registrations.map(reg => (
              <tr key={reg.id}>
                <td className="px-4 py-3">{reg.fullName}</td>
                <td className="px-4 py-3">{reg.email}</td>
                <td className="px-4 py-3">{reg.phone}</td>
                <td className="px-4 py-3">{reg.companyName || "—"}</td>
                <td className="px-4 py-3">{reg.jobTitle || "—"}</td>
                <td className="px-4 py-3">{reg.country || "—"}</td>
                <td className="px-4 py-3">
                  {new Date(reg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

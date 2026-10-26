"use client"
/** Implements the admin magazines id registrations page and its route-specific behavior. */


import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

/** Renders the registrations page interface. */
export default function RegistrationsPage() {
  const { id } = useParams()
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const token = localStorage.getItem("token")

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/magazines/${id}/registrations`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setData)
  }, [id])

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold mb-6">Magazine Registrations</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Company</th>
            <th className="p-2 border">Country</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r) => (
            <tr key={r.id}>
              <td className="p-2 border">{r.firstName} {r.lastName}</td>
              <td className="p-2 border">{r.email}</td>
              <td className="p-2 border">{r.companyName}</td>
              <td className="p-2 border">{r.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

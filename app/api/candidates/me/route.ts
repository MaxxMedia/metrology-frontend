/** Proxies authenticated candidate-profile requests to the backend. */
// import { cookies } from "next/headers"

// const BACKEND_URL = process.env.BACKEND_URL!

// function serializeCookies() {
//   const cookieStore = cookies()
//   return cookieStore
//     .getAll()
//     .map(c => `${c.name}=${c.value}`)
//     .join("; ")
// }

// export async function GET() {
//   const cookieHeader = serializeCookies()

//   const res = await fetch(`${BACKEND_URL}/candidates/me`, {
//     headers: {
//       Cookie: cookieHeader,
//     },
//     cache: "no-store",
//   })

//   const data = await res.json()
//   return Response.json(data, { status: res.status })
// }

// export async function PUT(req: Request) {
//   const body = await req.json()
//   const cookieHeader = serializeCookies()

//   const res = await fetch(`${BACKEND_URL}/candidates/me`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Cookie: cookieHeader,
//     },
//     body: JSON.stringify(body),
//   })

//   const data = await res.json()
//   return Response.json(data, { status: res.status })
// }
import { cookies } from "next/headers"

const BACKEND_URL = process.env.BACKEND_URL!

/** Serializes the incoming request cookies for the authenticated backend calls. */
async function serializeCookies() {
  const cookieStore = await cookies()

  return cookieStore
    .getAll()
    .map(c => `${c.name}=${c.value}`)
    .join("; ")
}

/** Retrieves the current candidate profile while forwarding the request cookies. */
export async function GET() {
  const cookieHeader = await serializeCookies()

  const res = await fetch(`${BACKEND_URL}/candidates/me`, {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}

/** Updates the current candidate profile while forwarding its authentication cookies. */
export async function PUT(req: Request) {
  const body = await req.json()
  const cookieHeader = await serializeCookies()

  const res = await fetch(`${BACKEND_URL}/candidates/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()
  return Response.json(data, { status: res.status })
}
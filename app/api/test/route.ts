/** Provides a lightweight endpoint for confirming that the frontend API route is reachable. */
/** Returns the test route health response. */
export async function GET() {
  const names: string[] = []

  return Response.json({
    message: "Test route working",
    names,
  })
}
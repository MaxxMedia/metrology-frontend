/** Implements the candidate username page and its route-specific behavior. */
import CandidateLinkedInProfile from "@/components/candidate/CandidateLinkedInProfile"

/** Renders the candidate profile page interface. */
export default async function CandidateProfilePage(props: {
  params: Promise<{ username: string }>
}) {
  const { username } = await props.params

  return <CandidateLinkedInProfile username={username} />
}
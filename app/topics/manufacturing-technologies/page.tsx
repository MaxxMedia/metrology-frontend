/** Implements the topics manufacturing technologies page and its route-specific behavior. */
import TopicPage from "../TopicPage";

/** Renders the manufacturing technologies page interface. */
export default function ManufacturingTechnologiesPage() {
  return (
    <TopicPage
      categorySlug="manufacturing-technologies"
      title="Manufacturing Technologies"
      description="Advanced manufacturing processes, additive manufacturing, production technologies, smart manufacturing, and industrial innovation."
      sectionTitle="Latest Manufacturing Technologies Articles"
    />
  );
}
/** Implements the topics factory automation page and its route-specific behavior. */
import TopicPage from "../TopicPage";

/** Renders the factory automation page interface. */
export default function FactoryAutomationPage() {
  return (
    <TopicPage
      categorySlug="factory-automation"
      title="Factory Automation"
      description="Automation technologies, robotics, Industry 4.0, smart factories, PLCs, sensors, and digital manufacturing."
      sectionTitle="Latest Factory Automation Articles"
    />
  );
}
/** Implements the topics cad cam cae page and its route-specific behavior. */
import TopicPage from "../TopicPage";

/** Renders the cad cam cae page interface. */
export default function CadCamCaePage() {
  return (
    <TopicPage
      categorySlug="cad-cam-cae"
      title="CAD/CAM/CAE"
      description="CAD, CAM, and CAE software, simulation, product design, engineering analysis, and digital product development."
      sectionTitle="Latest CAD/CAM/CAE Articles"
    />
  );
}
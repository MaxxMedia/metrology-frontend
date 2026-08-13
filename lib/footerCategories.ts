/** Parent category slugs from seedMetrologyCategories.js — used for footer ordering. */
export const METROLOGY_PARENT_SLUGS = [
  "dimensional-metrology",
  "precision-measuring-instruments",
  "coordinate-3d-metrology",
  "optical-and-vision-metrology",
  "surface-and-form-metrology",
  "geometric-dimensioning-and-tolerancing",
  "calibration-and-measurement-services",
  "material-and-mechanical-testing",
  "ndt-and-inspection",
  "manufacturing-metrology",
  "surface-and-3d-scanning",
  "sensors-and-measurement-technology",
  "process-and-industrial-measurement",
  "electrical-and-electronic-metrology",
  "metrology-software",
  "automation-and-robotics",
  "industry-specific-metrology",
] as const;

export type FooterCategoryLink = {
  label: string;
  href: string;
};

export function buildFooterCategoryColumns(
  categories: { name: string; slug: string }[]
): { top: FooterCategoryLink[]; more: FooterCategoryLink[] } {
  const ordered = METROLOGY_PARENT_SLUGS.map((slug) =>
    categories.find((c) => c.slug === slug)
  ).filter((c): c is { name: string; slug: string } => Boolean(c));

  const links: FooterCategoryLink[] = ordered.map((c) => ({
    label: c.name,
    href: `/topics/${c.slug}`,
  }));

  return {
    top: links.slice(0, 8),
    more: links.slice(8, 16),
  };
}

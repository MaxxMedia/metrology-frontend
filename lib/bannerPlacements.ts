/** Defines supported banner placements and their display dimensions for admin and publishing flows. */
﻿export const BANNER_PLACEMENTS = [
  { value: "HOME_TOP", label: "Home – Top", format: "Top Leaderboard", aspectRatio: "728 : 90 (~8.1:1)", standardSize: "728 × 90 px", retinaSize: "1456 × 180 px" },
  { value: "ARTICLE_TOP", label: "Article – Top", format: "Top Leaderboard", aspectRatio: "728 : 90 (~8.1:1)", standardSize: "728 × 90 px", retinaSize: "1456 × 180 px" },
  { value: "HOME_MIDDLE", label: "Home – Middle", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "HOME_BOTTOM", label: "Home – Bottom", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "ARTICLE_MIDDLE", label: "Article – Middle", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "ARTICLE_BOTTOM", label: "Article – Bottom", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "SUPPLIER_AFTER_VIDEO", label: "Supplier – After Video", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "FOOTER", label: "Footer", format: "Large Billboard", aspectRatio: "970 : 250 (~3.9:1)", standardSize: "970 × 250 px", retinaSize: "1940 × 500 px" },
  { value: "SIDEBAR", label: "Sidebar (Home)", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "EVENT_RIGHT", label: "Event – Right Rail", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "SUPPLIER_RIGHT", label: "Supplier – Right Rail", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "JOB_RIGHT", label: "Job – Right Rail", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "INDUSTRY_TALKS_RIGHT", label: "Industry Talks – Right", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "MAGAZINE_RIGHT", label: "Magazine – Right Rail", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
  { value: "Archive", label: "Archive – Right Rail", format: "Medium Rectangle", aspectRatio: "300 : 250 (6:5)", standardSize: "300 × 250 px", retinaSize: "600 × 500 px" },
] as const;

export type BannerPlacement =
  (typeof BANNER_PLACEMENTS)[number]["value"];

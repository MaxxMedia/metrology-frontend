// ---------------------------------------------------------------------------
// Category configuration for the Header mega-menu (Topics + Resources).
//
// MASTER_CATEGORIES below is the full metrology taxonomy. Only a handful of
// its top-level entries are actually wired into the nav today (see
// ACTIVE_TOPIC_SLUGS). To surface more categories later, add their slug to
// ACTIVE_TOPIC_SLUGS -- no other structural change is needed.
// ---------------------------------------------------------------------------

export type SubCategory = {
    label: string
    slug: string
}

export type MasterCategory = {
    label: string
    slug: string
    subcategories: SubCategory[]
}

// Full master taxonomy. Kept here (unused in the nav for now) so the
// Topics mega-menu can be expanded to more top-level categories later
// without redefining the data model.
export const MASTER_CATEGORIES: MasterCategory[] = [
    {
        label: "Dimensional Metrology",
        slug: "dimensional-metrology",
        subcategories: [
            { label: "Coordinate Measuring Machines (CMM)", slug: "coordinate-measuring-machines-cmm" },
            { label: "Portable CMM / Articulated Arms", slug: "portable-cmm-articulated-arms" },
            { label: "Height Gauges", slug: "height-gauges" },
            { label: "Profile Projectors", slug: "profile-projectors" },
            { label: "Optical Comparators", slug: "optical-comparators" },
            { label: "Vision Measuring Systems", slug: "vision-measuring-systems" },
            { label: "Measuring Microscopes", slug: "measuring-microscopes" },
            { label: "Form & Contour Measurement", slug: "form-and-contour-measurement" },
            { label: "Roundness & Cylindricity", slug: "roundness-and-cylindricity" },
            { label: "Surface Roughness", slug: "surface-roughness" },
            { label: "Thread Measurement", slug: "thread-measurement" },
            { label: "Gear Measurement", slug: "gear-measurement" },
            { label: "Length & Angle Measurement", slug: "length-and-angle-measurement" },
        ],
    },
    {
        label: "Precision Measuring Instruments",
        slug: "precision-measuring-instruments",
        subcategories: [
            { label: "Vernier Calipers", slug: "vernier-calipers" },
            { label: "Micrometers", slug: "micrometers" },
            { label: "Dial Gauges", slug: "dial-gauges" },
            { label: "Digital Gauges", slug: "digital-gauges" },
            { label: "Bore Gauges", slug: "bore-gauges" },
            { label: "Height Gauges", slug: "height-gauges" },
            { label: "Depth Gauges", slug: "depth-gauges" },
            { label: "Gauge Blocks", slug: "gauge-blocks" },
            { label: "Plug Gauges", slug: "plug-gauges" },
            { label: "Ring Gauges", slug: "ring-gauges" },
            { label: "Snap Gauges", slug: "snap-gauges" },
            { label: "Thread Gauges", slug: "thread-gauges" },
            { label: "Feeler Gauges", slug: "feeler-gauges" },
            { label: "Precision Levels", slug: "precision-levels" },
        ],
    },
    {
        label: "Coordinate & 3D Metrology",
        slug: "coordinate-3d-metrology",
        subcategories: [
            { label: "CMM", slug: "cmm" },
            { label: "Portable CMM", slug: "portable-cmm" },
            { label: "3D Scanners", slug: "3d-scanners" },
            { label: "Laser Scanners", slug: "laser-scanners" },
            { label: "Structured Light Scanners", slug: "structured-light-scanners" },
            { label: "Photogrammetry", slug: "photogrammetry" },
            { label: "3D Measurement Software", slug: "3d-measurement-software" },
            { label: "Reverse Engineering", slug: "reverse-engineering" },
            { label: "Point Cloud Processing", slug: "point-cloud-processing" },
            { label: "3D Inspection", slug: "3d-inspection" },
        ],
    },
    {
        label: "Optical & Vision Metrology",
        slug: "optical-and-vision-metrology",
        subcategories: [
            { label: "Machine Vision Systems", slug: "machine-vision-systems" },
            { label: "Video Measuring Machines", slug: "video-measuring-machines" },
            { label: "Optical Measurement Systems", slug: "optical-measurement-systems" },
            { label: "Digital Microscopes", slug: "digital-microscopes" },
            { label: "Industrial Microscopes", slug: "industrial-microscopes" },
            { label: "Image Measurement", slug: "image-measurement" },
            { label: "Automated Optical Inspection (AOI)", slug: "automated-optical-inspection-aoi" },
            { label: "Smart Cameras", slug: "smart-cameras" },
            { label: "Vision Software", slug: "vision-software" },
        ],
    },
    {
        label: "Surface & Form Metrology",
        slug: "surface-and-form-metrology",
        subcategories: [
            { label: "Surface Roughness", slug: "surface-roughness" },
            { label: "Surface Texture", slug: "surface-texture" },
            { label: "Contour Measurement", slug: "contour-measurement" },
            { label: "Roundness", slug: "roundness" },
            { label: "Cylindricity", slug: "cylindricity" },
            { label: "Straightness", slug: "straightness" },
            { label: "Flatness", slug: "flatness" },
            { label: "Parallelism", slug: "parallelism" },
            { label: "Perpendicularity", slug: "perpendicularity" },
            { label: "Profile Measurement", slug: "profile-measurement" },
            { label: "Surface Topography", slug: "surface-topography" },
        ],
    },
    {
        label: "Geometric Dimensioning & Tolerancing",
        slug: "geometric-dimensioning-and-tolerancing",
        subcategories: [
            { label: "GD&T Software", slug: "gdandt-software" },
            { label: "GD&T Training", slug: "gdandt-training" },
            { label: "Tolerance Analysis", slug: "tolerance-analysis" },
            { label: "Datum Systems", slug: "datum-systems" },
            { label: "Geometric Tolerances", slug: "geometric-tolerances" },
            { label: "Dimensional Tolerances", slug: "dimensional-tolerances" },
            { label: "SPC & Statistical Analysis", slug: "spc-and-statistical-analysis" },
            { label: "Quality Inspection Software", slug: "quality-inspection-software" },
        ],
    },
    {
        label: "Calibration & Measurement Services",
        slug: "calibration-and-measurement-services",
        subcategories: [
            { label: "Dimensional Calibration", slug: "dimensional-calibration" },
            { label: "Electrical Calibration", slug: "electrical-calibration" },
            { label: "Temperature Calibration", slug: "temperature-calibration" },
            { label: "Pressure Calibration", slug: "pressure-calibration" },
            { label: "Force Calibration", slug: "force-calibration" },
            { label: "Mass Calibration", slug: "mass-calibration" },
            { label: "Torque Calibration", slug: "torque-calibration" },
            { label: "Flow Calibration", slug: "flow-calibration" },
            { label: "Humidity Calibration", slug: "humidity-calibration" },
            { label: "Calibration Laboratories", slug: "calibration-laboratories" },
            { label: "NABL Accredited Laboratories", slug: "nabl-accredited-laboratories" },
            { label: "On-site Calibration", slug: "on-site-calibration" },
            { label: "Calibration Management Software", slug: "calibration-management-software" },
        ],
    },
    {
        label: "Material & Mechanical Testing",
        slug: "material-and-mechanical-testing",
        subcategories: [
            { label: "Hardness Testing", slug: "hardness-testing" },
            { label: "Tensile Testing", slug: "tensile-testing" },
            { label: "Compression Testing", slug: "compression-testing" },
            { label: "Impact Testing", slug: "impact-testing" },
            { label: "Fatigue Testing", slug: "fatigue-testing" },
            { label: "Universal Testing Machines", slug: "universal-testing-machines" },
            { label: "Material Testing Machines", slug: "material-testing-machines" },
            { label: "Metallurgical Testing", slug: "metallurgical-testing" },
            { label: "Non-Destructive Testing (NDT)", slug: "non-destructive-testing-ndt" },
        ],
    },
    {
        label: "NDT & Inspection",
        slug: "ndt-and-inspection",
        subcategories: [
            { label: "Ultrasonic Testing", slug: "ultrasonic-testing" },
            { label: "Radiographic Testing", slug: "radiographic-testing" },
            { label: "Magnetic Particle Testing", slug: "magnetic-particle-testing" },
            { label: "Dye Penetrant Testing", slug: "dye-penetrant-testing" },
            { label: "Eddy Current Testing", slug: "eddy-current-testing" },
            { label: "X-Ray Inspection", slug: "x-ray-inspection" },
            { label: "CT Inspection", slug: "ct-inspection" },
            { label: "Visual Inspection", slug: "visual-inspection" },
            { label: "Automated Inspection", slug: "automated-inspection" },
        ],
    },
    {
        label: "Manufacturing Metrology",
        slug: "manufacturing-metrology",
        subcategories: [
            { label: "In-process Measurement", slug: "in-process-measurement" },
            { label: "Shop-floor Metrology", slug: "shop-floor-metrology" },
            { label: "Automated Inspection", slug: "automated-inspection" },
            { label: "Inline Inspection", slug: "inline-inspection" },
            { label: "Post-process Inspection", slug: "post-process-inspection" },
            { label: "Tool Measurement", slug: "tool-measurement" },
            { label: "Machine Tool Calibration", slug: "machine-tool-calibration" },
            { label: "Manufacturing Quality Control", slug: "manufacturing-quality-control" },
            { label: "Closed-loop Manufacturing", slug: "closed-loop-manufacturing" },
            { label: "Digital Manufacturing Metrology", slug: "digital-manufacturing-metrology" },
        ],
    },
    {
        label: "Surface & 3D Scanning",
        slug: "surface-and-3d-scanning",
        subcategories: [
            { label: "Laser Scanning", slug: "laser-scanning" },
            { label: "3D Optical Scanning", slug: "3d-optical-scanning" },
            { label: "White Light Scanning", slug: "white-light-scanning" },
            { label: "Blue Light Scanning", slug: "blue-light-scanning" },
            { label: "Handheld 3D Scanners", slug: "handheld-3d-scanners" },
            { label: "Industrial CT", slug: "industrial-ct" },
            { label: "Surface Mapping", slug: "surface-mapping" },
            { label: "Reverse Engineering", slug: "reverse-engineering" },
        ],
    },
    {
        label: "Sensors & Measurement Technology",
        slug: "sensors-and-measurement-technology",
        subcategories: [
            { label: "Laser Sensors", slug: "laser-sensors" },
            { label: "Displacement Sensors", slug: "displacement-sensors" },
            { label: "Position Sensors", slug: "position-sensors" },
            { label: "Proximity Sensors", slug: "proximity-sensors" },
            { label: "Temperature Sensors", slug: "temperature-sensors" },
            { label: "Pressure Sensors", slug: "pressure-sensors" },
            { label: "Force Sensors", slug: "force-sensors" },
            { label: "Load Cells", slug: "load-cells" },
            { label: "Torque Sensors", slug: "torque-sensors" },
            { label: "Optical Sensors", slug: "optical-sensors" },
        ],
    },
    {
        label: "Process & Industrial Measurement",
        slug: "process-and-industrial-measurement",
        subcategories: [
            { label: "Temperature Measurement", slug: "temperature-measurement" },
            { label: "Pressure Measurement", slug: "pressure-measurement" },
            { label: "Flow Measurement", slug: "flow-measurement" },
            { label: "Level Measurement", slug: "level-measurement" },
            { label: "Humidity Measurement", slug: "humidity-measurement" },
            { label: "Vacuum Measurement", slug: "vacuum-measurement" },
            { label: "Vibration Measurement", slug: "vibration-measurement" },
            { label: "Force & Torque Measurement", slug: "force-and-torque-measurement" },
            { label: "Electrical Measurement", slug: "electrical-measurement" },
        ],
    },
    {
        label: "Electrical & Electronic Metrology",
        slug: "electrical-and-electronic-metrology",
        subcategories: [
            { label: "Digital Multimeters", slug: "digital-multimeters" },
            { label: "Oscilloscopes", slug: "oscilloscopes" },
            { label: "Electrical Calibrators", slug: "electrical-calibrators" },
            { label: "Voltage Measurement", slug: "voltage-measurement" },
            { label: "Current Measurement", slug: "current-measurement" },
            { label: "Resistance Measurement", slug: "resistance-measurement" },
            { label: "Power & Energy Measurement", slug: "power-and-energy-measurement" },
            { label: "RF & Microwave Measurement", slug: "rf-and-microwave-measurement" },
            { label: "Electronic Test Equipment", slug: "electronic-test-equipment" },
        ],
    },
    {
        label: "Metrology Software",
        slug: "metrology-software",
        subcategories: [
            { label: "CMM Software", slug: "cmm-software" },
            { label: "Measurement Software", slug: "measurement-software" },
            { label: "Inspection Software", slug: "inspection-software" },
            { label: "SPC Software", slug: "spc-software" },
            { label: "Statistical Analysis", slug: "statistical-analysis" },
            { label: "Calibration Management", slug: "calibration-management" },
            { label: "Quality Management Software", slug: "quality-management-software" },
            { label: "Digital Twin", slug: "digital-twin" },
            { label: "Digital Metrology", slug: "digital-metrology" },
            { label: "AI-Based Inspection", slug: "ai-based-inspection" },
            { label: "Automated Measurement Software", slug: "automated-measurement-software" },
        ],
    },
    {
        label: "Automation & Robotics",
        slug: "automation-and-robotics",
        subcategories: [
            { label: "Robotic Inspection", slug: "robotic-inspection" },
            { label: "Automated CMM", slug: "automated-cmm" },
            { label: "Robotic Measurement", slug: "robotic-measurement" },
            { label: "Automated Vision Inspection", slug: "automated-vision-inspection" },
            { label: "Inspection Cells", slug: "inspection-cells" },
            { label: "Robot-mounted 3D Scanners", slug: "robot-mounted-3d-scanners" },
            { label: "Smart Factory Metrology", slug: "smart-factory-metrology" },
            { label: "Industry 4.0 Metrology", slug: "industry-4-0-metrology" },
        ],
    },
    {
        label: "Industry-Specific Metrology",
        slug: "industry-specific-metrology",
        subcategories: [
            { label: "Automotive", slug: "automotive" },
            { label: "Aerospace", slug: "aerospace" },
            { label: "Defence", slug: "defence" },
            { label: "Medical Devices", slug: "medical-devices" },
            { label: "Electronics & Semiconductors", slug: "electronics-and-semiconductors" },
            { label: "Machine Tools", slug: "machine-tools" },
            { label: "Die & Mould", slug: "die-and-mould" },
            { label: "Precision Engineering", slug: "precision-engineering" },
            { label: "Oil & Gas", slug: "oil-and-gas" },
            { label: "Energy & Power", slug: "energy-and-power" },
            { label: "Railways", slug: "railways" },
            { label: "Consumer Electronics", slug: "consumer-electronics" },
            { label: "Automotive Components", slug: "automotive-components" },
            { label: "Plastics", slug: "plastics" },
            { label: "Additive Manufacturing", slug: "additive-manufacturing" },
            { label: "General Engineering", slug: "general-engineering" },
        ],
    },
]

// ---------------------------------------------------------------------------
// Active Topics shown in the Header "Topics" mega-menu.
//
// Per current requirements, only these 3 top-level categories are shown,
// pulled directly from MASTER_CATEGORIES above (so labels/slugs stay in
// sync with the master list rather than being duplicated).
//
// NOTE: these slugs ("dimensional-metrology", "precision-measuring-instruments",
// "coordinate-3d-metrology") do not exist among the categories the backend
// currently returns from /api/posts (existing categories are things like
// "machine", "cuttingtools", "metrologyandquality", etc). Until the backend
// creates matching post categories with these exact slugs, fetchPostsForSlug()
// will return an empty array for all three, and the mega-menu will correctly
// render "No articles found" rather than break. See the implementation notes
// returned alongside this file for details.
// ---------------------------------------------------------------------------
const ACTIVE_TOPIC_SLUGS = [
    "dimensional-metrology",
    "precision-measuring-instruments",
    "coordinate-3d-metrology",
] as const

export type ArticleTopic = {
    label: string
    slug: string
}

export const ARTICLE_TOPICS: ArticleTopic[] = ACTIVE_TOPIC_SLUGS.map((slug) => {
    const match = MASTER_CATEGORIES.find((c) => c.slug === slug)
    if (!match) {
        throw new Error(`ACTIVE_TOPIC_SLUGS references unknown master category slug: ${slug}`)
    }
    return { label: match.label, slug: match.slug }
})

// ---------------------------------------------------------------------------
// Resources mega-menu now has a single category: "Articles".
//
// There is no dedicated backend category called "articles" in the existing
// API (previous RESOURCE_TOPICS slugs were "webinars", "video", "events",
// "suppliers", "molddesign-optimization"). Rather than invent a category slug
// the backend doesn't recognize, "articles" is treated as a special slug in
// Header.tsx: fetchPostsForSlug skips the `category` query param for it and
// simply fetches the latest posts (/api/posts?limit=6). Update this if the
// backend later adds a real "articles" category.
// ---------------------------------------------------------------------------
export const RESOURCE_TOPICS: ArticleTopic[] = [
    { label: "Articles", slug: "articles" },
]

export const ARTICLE_TOPIC_SLUGS = ARTICLE_TOPICS.map((t) => t.slug)
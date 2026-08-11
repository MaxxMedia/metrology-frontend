export type ArticleTopic = {
    label: string
    slug: string
}

export const ARTICLE_TOPICS: ArticleTopic[] = [
    { label: "MACHINE TOOLS", slug: "machine" },
    { label: "CUTTING TOOLS", slug: "cuttingtools" },
    { label: "DIES, MOULDS & TOOLING", slug: "dies-moulds-and-tooling" },
    { label: "METROLOGY & QUALITY", slug: "metrologyandquality" },
    { label: "FACTORY AUTOMATION", slug: "factory-automation" },
    { label: "CAD/CAM/CAE", slug: "cad-cam-cae" },
    { label: "MANUFACTURING TECHNOLOGIES", slug: "manufacturing-technologies" },
]

export const RESOURCE_TOPICS: ArticleTopic[] = [
    { label: "WEBINARS", slug: "webinars" },
    { label: "VIDEOS", slug: "video" },
    { label: "EVENTS", slug: "events" },
    { label: "SUPPLIERS", slug: "suppliers" },
    { label: "TOOLING DESIGN & OPTIMIZATION", slug: "molddesign-optimization" },
]

export const ARTICLE_TOPIC_SLUGS = ARTICLE_TOPICS.map((t) => t.slug)
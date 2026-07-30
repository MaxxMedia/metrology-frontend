"use client"

import Image from "next/image"

type Advertisement = {
  id: string
  imageUrl: string
  alt: string
  link?: string
}

interface AdvertisementSectionProps {
  ads?: Advertisement[]
}

export default function AdvertisementSection({
  ads = [
    {
      id: "1",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-theaRafgMqeL8iaHcrhMXdrtVSoIro.png",
      alt: "PT Expo Event",
      link: "#",
    },
    {
      id: "2",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-1qROhRs9zU3qN0wIxISQ6IpsKsxNfE.png",
      alt: "Manufacturing Ad",
      link: "#",
    },
  ],
}: AdvertisementSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[#003049] mb-4 border-b border-gray-300 pb-2 uppercase">
          Advertisement
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        {ads.map((ad) => (
          <a
            key={ad.id}
            href={ad.link || "#"}
            className="block border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div className="relative w-full h-48 bg-gray-200">
              <Image
                src={ad.imageUrl || "/placeholder.svg"}
                alt={ad.alt}
                fill
                className="object-cover hover:opacity-90 transition-opacity"
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

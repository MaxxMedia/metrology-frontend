import { NextRequest, NextResponse } from "next/server";

type GeoPayload = {
  success?: boolean;
  latitude?: number;
  longitude?: number;
  country?: string;
  city?: string;
  region?: string;
  message?: string;
};

function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const cfIp = req.headers.get("cf-connecting-ip")?.trim();
  if (cfIp) return cfIp;

  return null;
}

function isPrivateIp(ip: string): boolean {
  return (
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) ||
    ip.startsWith("fc") ||
    ip.startsWith("fd") ||
    ip.startsWith("fe80:")
  );
}

async function lookupGeo(ip: string | null): Promise<GeoPayload | null> {
  const url =
    ip && !isPrivateIp(ip) ? `https://ipwho.is/${encodeURIComponent(ip)}` : "https://ipwho.is/";

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as GeoPayload;
  if (data.success === false) return null;
  return data;
}

async function lookupTemp(lat: number, lon: number): Promise<number | null> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m");
  url.searchParams.set("temperature_unit", "celsius");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    next: { revalidate: 1800 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  const temp = data?.current?.temperature_2m;
  return typeof temp === "number" ? temp : null;
}

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const geo = await lookupGeo(ip);

    if (
      !geo ||
      typeof geo.latitude !== "number" ||
      typeof geo.longitude !== "number"
    ) {
      return NextResponse.json(
        { error: "Could not resolve location from IP" },
        { status: 502 }
      );
    }

    const temperature = await lookupTemp(geo.latitude, geo.longitude);
    if (temperature === null) {
      return NextResponse.json(
        { error: "Could not fetch weather for location" },
        { status: 502 }
      );
    }

    const country = geo.country?.trim() || "Unknown";

    return NextResponse.json(
      {
        temperature: Math.round(temperature * 10) / 10,
        country,
        city: geo.city?.trim() || null,
        region: geo.region?.trim() || null,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=1800",
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to resolve geo weather" },
      { status: 500 }
    );
  }
}

"use client";
/** Implements the admin banners edit id page and its route-specific behavior. */


import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BannerForm from "../../BannerForm";

/** Renders the edit banner page interface. */
export default function EditBannerPage() {
  const { id } = useParams(); // ✅ FIX
  const router = useRouter();

  const [banner, setBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    /** Loads banner for the current workflow. */
    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!res.ok) throw new Error("Banner not found");

        const data = await res.json();
        setBanner(data);
      } catch (error) {
        console.error("Fetch error:", error);
        setBanner(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [id]);

  /** Updates the banner record or interface state. */
  const updateBanner = async (updatedData: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/banners/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      alert("Banner updated successfully ✅");
      router.push("/admin/banners");
    } catch (error) {
      console.error(error);
      alert("Failed to update banner ❌");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!banner) return <p className="p-6 text-red-500">Banner not found</p>;

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Edit Banner</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <BannerForm initialData={banner} onSubmit={updateBanner} />
      </div>
    </div>
  );
}
"use client";
/** Implements the admin banners new page and its route-specific behavior. */


import { useRouter } from "next/navigation";
import BannerForm from "../BannerForm";

/** Renders the new banner page interface. */
export default function NewBannerPage() {
  const router = useRouter();

  /** Creates the banner record or interface element. */
  const createBanner = async (data: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create banner");
      }

      alert("Banner created successfully ✅");
      router.push("/admin/banners");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to create banner ❌");
    }
  };

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 text-slate-900">Create Banner</h1>
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <BannerForm onSubmit={createBanner} />
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextField";
import UploadBox from "@/components/UploadBox";
import { loadGeo } from "@/lib/geo";
import {
  fetchProductListingEligibility,
  fetchCompanyProfileEligibility,
  type ContentLimitEligibility,
  type CompanyProfileEligibility,
} from "@/lib/packageLimits";
import { PlanGatedSection } from "@/components/recruiter/PlanGatedSection";

async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.imageUrl;
}

async function uploadDocument(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("document", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload/document`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  return data.documentUrl;
}

// Counts how many gallery entries actually have an image set (i.e. would
// survive the cleanGallery() filter below). Mirrors the same helper on the
// "new directory" page so both pages can enforce gallery limits consistently
// if you wire up client-side validation before saving.
function countGalleryItems(gallery: any[]): number {
  if (!Array.isArray(gallery)) return 0;
  return gallery.filter(
    (item) => item && typeof item.image === "string" && item.image.trim().length > 0
  ).length;
}

type GalleryItem = {
  image: string;
  name: string;
  description: string;
};

export default function EditDirectoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [directory, setDirectory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingCatalogue, setUploadingCatalogue] = useState(false);
  const [uploadingGalleryImage, setUploadingGalleryImage] = useState(false);
  const [listingEligibility, setListingEligibility] =
    useState<ContentLimitEligibility | null>(null);
  const [profileLimits, setProfileLimits] = useState<CompanyProfileEligibility | null>(null);
  const [geo, setGeo] = useState<Awaited<ReturnType<typeof loadGeo>> | null>(null);

  const [industryLevels, setIndustryLevels] = useState<any[][]>([]);
  const [industrySelected, setIndustrySelected] = useState<number[]>([]);

  // ✅ Helper: Check if a value is unlimited
  const isUnlimited = (value: any): boolean => {
    return value === null || value === "Unlimited" || value === Infinity;
  };

  // ✅ Helper: Get display limit
  const getDisplayLimit = (value: any): string | number => {
    if (isUnlimited(value)) return "Unlimited";
    return value;
  };

  // ✅ Helper: Check if feature is allowed (null = unlimited = allowed)
  const isFeatureAllowed = (value: any): boolean => {
    if (value === null || value === "Unlimited") return true;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value > 0;
    if (typeof value === "string") {
      return value.length > 0 && value !== "false" && value !== "0";
    }
    return !!value;
  };

  // ✅ Helper: Get numeric limit (null = unlimited)
  const getFeatureLimit = (value: any): number | null => {
    if (value === null || value === "Unlimited") return null;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const parsed = parseInt(value);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  };

  const maxCoverImages = listingEligibility?.maxCoverImages ?? 0;
  const allowWhatsapp = listingEligibility?.allowWhatsapp ?? false;

  // Check if user is on Professional or Enterprise for unlimited features
  const isProfessional = profileLimits?.plan === "professional";
  const isEnterprise = profileLimits?.plan === "enterprise";
  const isProfessionalOrEnterprise = isProfessional || isEnterprise;

  useEffect(() => {
    loadGeo().then(setGeo).catch(console.error);
  }, []);

  useEffect(() => {
    async function loadEligibility() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        setListingEligibility(await fetchProductListingEligibility(token));
        setProfileLimits(await fetchCompanyProfileEligibility(token));
      } catch (error) {
        console.error("Eligibility error:", error);
      }
    }
    loadEligibility();
  }, []);

  useEffect(() => {
    async function fetchIndustries() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries`);
      const data = await res.json();
      const list = Array.isArray(data) ? data : data.data ?? [];
      setIndustryLevels([list]);
    }
    fetchIndustries();
  }, []);

  useEffect(() => {
    async function loadDirectory() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/recruiter/directories/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();

        let coverImages = [];
        if (Array.isArray(data.coverImageUrl)) {
          coverImages = data.coverImageUrl;
        } else if (typeof data.coverImageUrl === "string" && data.coverImageUrl) {
          coverImages = [data.coverImageUrl];
        } else {
          coverImages = [""];
        }

        // Normalize gallery data - ensure objects have all fields
        const normalizeGallery = (gallery: any[]) => {
          if (!Array.isArray(gallery)) return [];
          return gallery.map(item => {
            if (typeof item === 'string') {
              return { image: item, name: "", description: "" };
            }
            return {
              image: item?.image || "",
              name: item?.name || "",
              description: item?.description || ""
            };
          });
        };

        setDirectory({
          id: data.id,
          name: data.name || "",
          slug: data.slug || "",
          phoneNumber: data.phoneNumber || "",
          email: data.email || "",
          description: data.description || "",
          website: data.website || "",
          logoUrl: data.logoUrl || "",
          googleMapUrl: data.googleMapUrl || "",
          tradeNames: Array.isArray(data.tradeNames) ? data.tradeNames : [""],
          videoGallery: Array.isArray(data.videoGallery) ? data.videoGallery : [""],
          productSupplies: Array.isArray(data.productSupplies) ? data.productSupplies : [""],
          socialLinks: data.socialLinks || {},
          country: data.country || "",
          state: data.state || "",
          city: data.city || "",
          address: data.address || "",
          industryId: data.industryId || "",
          coverImages: coverImages,
          productGallery: normalizeGallery(data.productGallery),
          companyGallery: normalizeGallery(data.companyGallery),
          factoryGallery: normalizeGallery(data.factoryGallery),
          productCatalogues: Array.isArray(data.productCatalogues) ? data.productCatalogues : [""],
          companyBrochure: Array.isArray(data.companyBrochure) ? data.companyBrochure : [""],
          certifications: Array.isArray(data.certifications) ? data.certifications : [""],
          brandsRepresented: Array.isArray(data.brandsRepresented) ? data.brandsRepresented : [""],
          industriesServed: Array.isArray(data.industriesServed) ? data.industriesServed : [""],
          exportMarkets: Array.isArray(data.exportMarkets) ? data.exportMarkets : [""],
          manufacturingCapabilities: data.manufacturingCapabilities || "",
          manufacturingCapabilityImages: Array.isArray(data.manufacturingCapabilityImages) ? data.manufacturingCapabilityImages : [],
          manufacturingCapabilityVideos: Array.isArray(data.manufacturingCapabilityVideos) ? data.manufacturingCapabilityVideos : [],
          machineryList: data.machineryList || "",
          machineryImages: Array.isArray(data.machineryImages) ? data.machineryImages : [],
          qualityStandards: data.qualityStandards || "",
          enableInquiryForm: data.enableInquiryForm ?? true,
          isLiveEditable: data.isLiveEditable ?? false,
        });
      } catch (error) {
        console.error("Load directory error:", error);
        alert("Unable to load directory");
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, [id]);

  const handleIndustrySelect = async (levelIndex: number, id: number) => {
    const newSelected = [...industrySelected.slice(0, levelIndex), id];
    const newLevels = industryLevels.slice(0, levelIndex + 1);
    setIndustrySelected(newSelected);
    setIndustryLevels(newLevels);
    setDirectory((prev: any) => ({ ...prev, industryId: "" }));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/industries/${id}/children`);
    const children = await res.json();

    if (children.length > 0) {
      setIndustryLevels([...newLevels, children]);
    } else {
      setDirectory((prev: any) => ({ ...prev, industryId: id }));
    }
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    setDirectory((prev: any) => {
      const arr = [...(prev[field] || [])];
      arr[index] = value;
      return { ...prev, [field]: arr };
    });
  };

  const addArrayItem = (field: string) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, idx: number) => idx !== index),
    }));
  };

  const handleImageUpload = async (
    field: string,
    index: number,
    file: File
  ) => {
    const url = await uploadFile(file);
    updateArrayItem(field, index, url);
  };

  // ✅ NEW: Document upload handler for GallerySection
  const handleDocumentUpload = async (
    field: string,
    index: number,
    file: File
  ) => {
    try {
      const url = await uploadDocument(file);
      updateArrayItem(field, index, url);
    } catch (error: any) {
      setSaveError(error.message || "Failed to upload document");
      throw error;
    }
  };

  // Handle gallery image upload with object structure
  const handleGalleryImageUpload = async (
    field: string,
    index: number,
    file: File
  ) => {
    setUploadingGalleryImage(true);
    try {
      const url = await uploadFile(file);
      setDirectory((prev: any) => {
        const arr = [...(prev[field] || [])];
        arr[index] = { ...arr[index], image: url };
        return { ...prev, [field]: arr };
      });
    } catch (error: any) {
      setSaveError(error.message || "Failed to upload image");
    } finally {
      setUploadingGalleryImage(false);
    }
  };

  // Update gallery item field
  const updateGalleryItem = (field: string, index: number, key: string, value: string) => {
    setDirectory((prev: any) => {
      const arr = [...(prev[field] || [])];
      arr[index] = { ...arr[index], [key]: value };
      return { ...prev, [field]: arr };
    });
  };

  // Add new gallery item
  const addGalleryItem = (field: string) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), { image: "", name: "", description: "" }],
    }));
  };

  // Remove gallery item
  const removeGalleryItem = (field: string, index: number) => {
    setDirectory((prev: any) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_: any, idx: number) => idx !== index),
    }));
  };

  const handleCatalogueUpload = async (field: string, index: number, file: File) => {
    setUploadingCatalogue(true);
    try {
      const url = await uploadDocument(file);
      updateArrayItem(field, index, url);
    } catch (error: any) {
      setSaveError(error.message || "Failed to upload document");
    } finally {
      setUploadingCatalogue(false);
    }
  };

  // ✅ NEW: Handle manufacturing image upload
  const handleManufacturingImageUpload = async (index: number, file: File) => {
    const url = await uploadFile(file);
    const arr = [...(directory.manufacturingCapabilityImages || [])];
    arr[index] = url;
    setDirectory({ ...directory, manufacturingCapabilityImages: arr });
  };

  // ✅ NEW: Handle manufacturing video URL update
  const handleManufacturingVideoUpdate = (index: number, value: string) => {
    const arr = [...(directory.manufacturingCapabilityVideos || [])];
    arr[index] = value;
    setDirectory({ ...directory, manufacturingCapabilityVideos: arr });
  };

  // ✅ NEW: Handle machinery image upload
  const handleMachineryImageUpload = async (index: number, file: File) => {
    const url = await uploadFile(file);
    const arr = [...(directory.machineryImages || [])];
    arr[index] = url;
    setDirectory({ ...directory, machineryImages: arr });
  };

  async function saveChanges() {
    if (!directory?.isLiveEditable) {
      setSaveError("This directory is pending approval and cannot be edited yet.");
      return;
    }

    const validationErrors: string[] = [];
    if (!directory.name?.trim()) validationErrors.push("Company name is required.");
    if (!directory.phoneNumber?.trim()) validationErrors.push("Phone number is required.");
    if (!directory.email?.trim()) validationErrors.push("Email is required.");
    if (directory.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(directory.email))
      validationErrors.push("Please enter a valid email address.");
    if (!directory.description?.trim() || directory.description.trim().length < 20)
      validationErrors.push("Description must be at least 20 characters.");
    if (!directory.country) validationErrors.push("Country is required.");
    if (!directory.state) validationErrors.push("State is required.");
    if (!directory.city) validationErrors.push("City is required.");
    if (!directory.address?.trim() || directory.address.trim().length < 10)
      validationErrors.push("Full address must be at least 10 characters.");
    if (!directory.industryId) validationErrors.push("Industry is required.");

    // Gallery limit checks (mirrors the "new directory" page)
    const galleryLimitChecks: Array<{ field: string; label: string; limit: number | null }> = [
      { field: "productGallery", label: "Product Gallery", limit: getFeatureLimit(profileLimits?.productImages) },
      { field: "companyGallery", label: "Company Gallery", limit: getFeatureLimit(profileLimits?.galleryImages) },
      { field: "factoryGallery", label: "Factory Gallery", limit: getFeatureLimit(profileLimits?.factoryImages) },
    ];
    for (const check of galleryLimitChecks) {
      const count = countGalleryItems(directory[check.field]);
      if (check.limit !== null && count > check.limit) {
        validationErrors.push(
          `${check.label} has ${count} images, but your plan allows up to ${check.limit}.`
        );
      }
    }

    if (validationErrors.length > 0) {
      setSaveError(validationErrors.join(" "));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      setSaving(true);
      setSaveError("");
      const token = localStorage.getItem("token");
      if (!token) {
        setSaveError("Not authenticated");
        return;
      }

      const geoLib = geo ?? (await loadGeo());

      const selectedCountry = geoLib.Country.getAllCountries().find(
        (c) => c.isoCode === directory.country
      );
      const selectedState = geoLib.State.getStatesOfCountry(directory.country).find(
        (s) => s.isoCode === directory.state
      );
      const location = [directory.city, selectedState?.name, selectedCountry?.name]
        .filter(Boolean)
        .join(", ");

      const cleanArray = (arr: any[]) => arr.filter((item) => item && item.trim().length > 0);

      // Clean gallery arrays - remove items without image
      const cleanGallery = (gallery: GalleryItem[]) => {
        if (!Array.isArray(gallery)) return [];
        return gallery.filter(item => item.image && item.image.trim().length > 0);
      };

      const payload = {
        name: directory.name,
        slug: directory.slug,
        description: directory.description,
        website: directory.website || null,
        logoUrl: directory.logoUrl || null,
        coverImageUrl: cleanArray(directory.coverImages),
        phoneNumber: directory.phoneNumber || null,
        email: directory.email || null,
        googleMapUrl: directory.googleMapUrl || null,
        tradeNames: cleanArray(directory.tradeNames),
        socialLinks: directory.socialLinks || {},
        videoGallery: cleanArray(directory.videoGallery),
        productSupplies: cleanArray(directory.productSupplies),
        productGallery: cleanGallery(directory.productGallery),
        companyGallery: cleanGallery(directory.companyGallery),
        factoryGallery: cleanGallery(directory.factoryGallery),
        productCatalogues: cleanArray(directory.productCatalogues),
        companyBrochure: cleanArray(directory.companyBrochure),
        certifications: cleanArray(directory.certifications),
        brandsRepresented: cleanArray(directory.brandsRepresented),
        industriesServed: cleanArray(directory.industriesServed),
        exportMarkets: cleanArray(directory.exportMarkets),
        manufacturingCapabilities: directory.manufacturingCapabilities || null,
        manufacturingCapabilityImages: cleanArray(directory.manufacturingCapabilityImages || []),
        manufacturingCapabilityVideos: cleanArray(directory.manufacturingCapabilityVideos || []),
        machineryList: directory.machineryList || null,
        machineryImages: cleanArray(directory.machineryImages || []),
        qualityStandards: directory.qualityStandards || null,
        enableInquiryForm: directory.enableInquiryForm ?? true,
        location,
        address: directory.address,
        industryId: Number(directory.industryId),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${directory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setSaveError(errorData.error || "Failed to save changes");
        return;
      }

      setSaveSuccess(true);
      setTimeout(() => {
        router.push("/recruiter/dashboard");
      }, 1800);
    } catch (error: any) {
      console.error("Save error:", error);
      setSaveError(error.message || "An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !geo) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] flex items-center justify-center p-10">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-[#00B5ED] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-[#CCCCCC]">Loading directory…</p>
        </div>
      </div>
    );
  }
  if (!directory) {
    return (
      <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] flex items-center justify-center p-10">
        <p className="text-[#CCCCCC]">Directory not found</p>
      </div>
    );
  }

  const states = directory.country ? geo.State.getStatesOfCountry(directory.country) : [];
  const cities = directory.state ? geo.City.getCitiesOfState(directory.country, directory.state) : [];
  const countries = geo.Country.getAllCountries();

  return (
    <div className="min-h-screen bg-[#171A1E] text-[#CCCCCC] p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6 bg-[#1D2125] border border-[#292C30] p-6 md:p-8 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-[#FFFFFF]">Edit Supplier Directory</h1>

        {saveSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Changes saved successfully! Redirecting to dashboard...</span>
          </div>
        )}

        {saveError && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 px-4 py-3 rounded-xl">
            <p className="font-semibold mb-1">Please fix the following:</p>
            <p>{saveError}</p>
          </div>
        )}

      {/* NAME + SLUG */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Company Name</label>
          <input
            className="input"
            value={directory.name}
            onChange={(e) => setDirectory({ ...directory, name: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Slug (read only)</label>
          <input className="input bg-[#171A1E] text-[#B8B8B8] border-[#292C30] cursor-not-allowed" value={directory.slug} disabled />
        </div>
      </div>

      {/* PHONE + EMAIL */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Phone Number</label>
          <input
            className="input"
            value={directory.phoneNumber || ""}
            onChange={(e) => setDirectory({ ...directory, phoneNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={directory.email || ""}
            onChange={(e) => setDirectory({ ...directory, email: e.target.value })}
          />
        </div>
      </div>

      {/* COUNTRY + STATE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Country</label>
          <select
            className="input"
            value={directory.country}
            onChange={(e) =>
              setDirectory({ ...directory, country: e.target.value, state: "", city: "" })
            }
          >
            <option value="" className="bg-[#171A1E] text-[#FFFFFF]">Select Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode} className="bg-[#171A1E] text-[#FFFFFF]">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">State</label>
          <select
            className="input"
            value={directory.state}
            onChange={(e) => setDirectory({ ...directory, state: e.target.value, city: "" })}
          >
            <option value="" className="bg-[#171A1E] text-[#FFFFFF]">Select State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode} className="bg-[#171A1E] text-[#FFFFFF]">
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* CITY + ADDRESS */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">City</label>
          <select
            className="input"
            value={directory.city}
            onChange={(e) => setDirectory({ ...directory, city: e.target.value })}
          >
            <option value="" className="bg-[#171A1E] text-[#FFFFFF]">Select City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#171A1E] text-[#FFFFFF]">
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Full Address</label>
          <input
            className="input"
            value={directory.address || ""}
            onChange={(e) => setDirectory({ ...directory, address: e.target.value })}
          />
        </div>
      </div>

      {/* GOOGLE MAP - GATED BY PACKAGE */}
      <Section title="Google Map">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.googleMap)}
          upgradeMessage="Google Map is available on Basic plan and above."
        >
          <div>
            <label className="label">Google Maps Embed/Share URL</label>
            <input
              className="input"
              value={directory.googleMapUrl || ""}
              onChange={(e) => setDirectory({ ...directory, googleMapUrl: e.target.value })}
              placeholder="https://www.google.com/maps/embed?..."
            />
            <p className="text-xs text-[#B8B8B8] mt-1">
              Paste the "Share" link from Google Maps for your business location.
            </p>
          </div>
        </PlanGatedSection>
      </Section>

      {/* INDUSTRY + WEBSITE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Industry</label>
          {industryLevels.map((levelOptions, levelIndex) => (
            <select
              key={levelIndex}
              className="input mb-2"
              value={industrySelected[levelIndex] ?? ""}
              onChange={(e) => handleIndustrySelect(levelIndex, Number(e.target.value))}
            >
              <option value="" className="bg-[#171A1E] text-[#FFFFFF]">Select Industry</option>
              {levelOptions.map((industry: any) => (
                <option key={industry.id} value={industry.id} className="bg-[#171A1E] text-[#FFFFFF]">
                  {industry.name}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div>
          <label className="label">Website</label>
          <input
            className="input"
            value={directory.website || ""}
            onChange={(e) => setDirectory({ ...directory, website: e.target.value })}
          />
        </div>
      </div>

      {/* DESCRIPTION */}
      {(() => {
        const wordLimit = getFeatureLimit(profileLimits?.descriptionLimit);
        const wordCount = directory.description
          ? directory.description.trim().split(/\s+/).filter(Boolean).length
          : 0;
        const atLimit = wordLimit !== null && wordCount >= wordLimit;

        return (
          <div>
            <label className="label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={directory.description || ""}
              onChange={(e) => {
                const raw = e.target.value;
                if (wordLimit !== null) {
                  const words = raw.trimStart().split(/\s+/);
                  if (words.filter(Boolean).length > wordLimit) {
                    const truncated = words.slice(0, wordLimit).join(" ");
                    setDirectory({ ...directory, description: truncated });
                    return;
                  }
                }
                setDirectory({ ...directory, description: raw });
              }}
              className={`w-full rounded-xl border p-3 text-sm focus:outline-none focus:ring-2 bg-[#171A1E] text-[#FFFFFF] placeholder:text-[#858585] ${atLimit
                ? "border-rose-500 focus:ring-rose-500"
                : "border-[#292C30] focus:ring-[#00B5ED]"
                }`}
              placeholder="Enter your description..."
            />
            <div className="flex items-center justify-between mt-1">
              {wordLimit !== null ? (
                <p className={`text-xs ml-auto ${atLimit ? "text-rose-400 font-medium" : "text-[#B8B8B8]"}`}>
                  {wordCount} / {wordLimit} words{atLimit ? " — limit reached" : ""}
                </p>
              ) : (
                <p className="text-xs text-[#B8B8B8] ml-auto">
                  {wordCount} word{wordCount !== 1 ? "s" : ""} · Unlimited on your plan
                </p>
              )}
            </div>
          </div>
        );
      })()}

      {/* LOGO */}
      <div className="grid grid-cols-2 gap-6">
        <UploadBox
          label="Company Logo"
          value={directory.logoUrl}
          onUpload={(file) => uploadFile(file).then(url => setDirectory({ ...directory, logoUrl: url }))}
        />
      </div>

      {/* COVER IMAGES */}
      <Section title="Cover Images">
        {!isFeatureAllowed(maxCoverImages) ? (
          <div className="rounded-xl border border-dashed border-[#292C30] bg-[#171A1E] p-4 text-sm text-[#B8B8B8]">
            Cover images are available on the Basic plan and above. Upgrade your
            plan to add a cover banner to your showroom page.
          </div>
        ) : (
          <>
            <p className="text-xs text-[#B8B8B8] mb-2">
              Your plan allows up to {getDisplayLimit(maxCoverImages)} cover image
              {typeof maxCoverImages === "number" && maxCoverImages !== 1 ? "s" : ""}.
              {isUnlimited(maxCoverImages) ? "" : maxCoverImages > 1 ? " Multiple images will display as a carousel." : ""}
            </p>
            <GallerySection
              field="coverImages"
              items={directory.coverImages}
              onUpload={handleImageUpload}
              onAdd={addArrayItem}
              onRemove={removeArrayItem}
              addLabel="+ Add cover image"
              uploadLabel="Cover Image"
              max={getFeatureLimit(maxCoverImages)}
              allowRemoveFirst
            />
          </>
        )}
      </Section>

      {/* PRODUCT SUPPLIES */}
      <Section title="Product Supplies">
        {listingEligibility && (
          <p className="text-sm text-[#B8B8B8] mb-3">
            Products inside your directory do not count toward your directory slot limit.
            Your plan allows {getDisplayLimit(listingEligibility.effectiveLimit)} product supplies.
          </p>
        )}
        {directory.productSupplies.map((item: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const arr = [...directory.productSupplies]
                arr[i] = e.target.value
                setDirectory({ ...directory, productSupplies: arr })
              }}
            />
            {i > 0 && (
              <button type="button" onClick={() => {
                const arr = directory.productSupplies.filter((_: any, idx: number) => idx !== i)
                setDirectory({ ...directory, productSupplies: arr })
              }} className="text-rose-400 hover:text-rose-300 font-bold px-2">✕</button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setDirectory({
              ...directory,
              productSupplies: [...directory.productSupplies, ""],
            })
          }
          className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
        >
          + Add product
        </button>
      </Section>

      {/* PRODUCT CATALOGUES - GATED BY PACKAGE */}
      <Section title="Product Catalogues">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.productCatalogues)}
          upgradeMessage="Product Catalogues are available on Basic plan and above."
        >
          <p className="text-sm text-[#B8B8B8] mb-3">
            Upload your product catalogues (PDFs, brochures, etc.).
            {!isUnlimited(profileLimits?.productCatalogues) &&
              ` Your plan allows up to ${getDisplayLimit(profileLimits?.productCatalogues)} catalogues.`}
            {isUnlimited(profileLimits?.productCatalogues) &&
              ` Unlimited catalogues on your plan.`}
          </p>
          <div className="grid grid-cols-2 gap-4">
            {directory.productCatalogues.map((url: string, i: number) => (
              <div key={i} className="space-y-1">
                <UploadBox
                  label={`Product Catalogue ${i + 1}`}
                  value={url}
                  onUpload={(file) => handleCatalogueUpload("productCatalogues", i, file)}
                  uploadType="document"
                  accept=".pdf,.doc,.docx"
                />
                <button type="button" onClick={() => removeArrayItem("productCatalogues", i)} className="text-rose-400 hover:text-rose-300 text-xs font-semibold mt-1">
                  ✕ Remove
                </button>
              </div>
            ))}
            <div className="col-span-2">
              <button
                type="button"
                onClick={() => addArrayItem("productCatalogues")}
                disabled={
                  !isUnlimited(profileLimits?.productCatalogues) &&
                  directory.productCatalogues.length >= (getFeatureLimit(profileLimits?.productCatalogues) ?? 0)
                }
                className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
              >
                + Add product catalogue
                {!isUnlimited(profileLimits?.productCatalogues) &&
                  ` (${directory.productCatalogues.length}/${getDisplayLimit(profileLimits?.productCatalogues)})`}
              </button>
            </div>
          </div>
        </PlanGatedSection>
      </Section>

      {/* SOCIAL LINKS - WhatsApp gated */}
      <Section title="Social Media">
        <div className="grid grid-cols-2 gap-4">
          {["facebook", "linkedin", "twitter", "youtube"].map((key) => (
            <div key={key}>
              <label className="label capitalize">{key}</label>
              <input
                className="input"
                placeholder={key}
                value={directory.socialLinks?.[key] || ""}
                onChange={(e) =>
                  setDirectory({
                    ...directory,
                    socialLinks: { ...directory.socialLinks, [key]: e.target.value },
                  })
                }
              />
            </div>
          ))}
          {allowWhatsapp ? (
            <div>
              <label className="label">WhatsApp</label>
              <input
                className="input"
                placeholder="WhatsApp number"
                value={directory.socialLinks?.whatsapp || ""}
                onChange={(e) =>
                  setDirectory({
                    ...directory,
                    socialLinks: { ...directory.socialLinks, whatsapp: e.target.value },
                  })
                }
              />
            </div>
          ) : (
            <div>
              <label className="label">WhatsApp</label>
              <div className="rounded-xl border border-dashed border-[#292C30] bg-[#171A1E] p-3 text-xs text-[#B8B8B8]">
                Available on Basic plan and above.
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* TRADE NAMES */}
      <Section title="Trade Names">
        {directory.tradeNames.map((item: string, i: number) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              className="input flex-1"
              value={item}
              onChange={(e) => {
                const arr = [...directory.tradeNames];
                arr[i] = e.target.value;
                setDirectory({ ...directory, tradeNames: arr });
              }}
            />
            {i > 0 && (
              <button
                type="button"
                onClick={() => {
                  const arr = directory.tradeNames.filter(
                    (_: any, idx: number) => idx !== i
                  );
                  setDirectory({ ...directory, tradeNames: arr });
                }}
                className="text-rose-400 hover:text-rose-300 font-bold px-2"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setDirectory({ ...directory, tradeNames: [...directory.tradeNames, ""] })
          }
          className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
        >
          + Add trade name
        </button>
      </Section>

      {/* VIDEO GALLERY - GATED BY PACKAGE */}
      <Section title="Product YouTube Video Links">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.productVideos)}
          upgradeMessage="Product Videos are available on Basic plan and above."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {isUnlimited(profileLimits?.productVideos)
              ? "Unlimited videos on your plan."
              : `Your plan allows up to ${getDisplayLimit(profileLimits?.productVideos)} videos.`}
          </p>
          {directory.videoGallery.map((item: string, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="input flex-1"
                value={item}
                onChange={(e) => {
                  const arr = [...directory.videoGallery]
                  arr[i] = e.target.value
                  setDirectory({ ...directory, videoGallery: arr })
                }}
                placeholder="YouTube URL"
              />
              {i > 0 && (
                <button type="button" onClick={() => {
                  const arr = directory.videoGallery.filter((_: any, idx: number) => idx !== i)
                  setDirectory({ ...directory, videoGallery: arr })
                }} className="text-rose-400 hover:text-rose-300 px-2 font-bold">✕</button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => setDirectory({ ...directory, videoGallery: [...directory.videoGallery, ""] })}
            disabled={
              !isUnlimited(profileLimits?.productVideos) &&
              directory.videoGallery.length >= (getFeatureLimit(profileLimits?.productVideos) ?? 0)
            }
            className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
          >
            + Add video
            {!isUnlimited(profileLimits?.productVideos) &&
              ` (${directory.videoGallery.length}/${getDisplayLimit(profileLimits?.productVideos)})`}
          </button>
        </PlanGatedSection>
      </Section>

      {/* PRODUCT GALLERY - GATED BY PACKAGE */}
      <Section title="Product Gallery">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.productImages)}
          upgradeMessage="Product Gallery is available on all plans. Free plan allows up to 10 images."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {isUnlimited(profileLimits?.productImages)
              ? "Unlimited product images on your plan."
              : `Your plan allows up to ${getDisplayLimit(profileLimits?.productImages)} product images.`}
          </p>
          <div className="space-y-4">
            {directory.productGallery.map((item: GalleryItem, i: number) => (
              <div key={i} className="p-4 border border-[#292C30] rounded-xl space-y-3 bg-[#171A1E] text-[#CCCCCC]">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#FFFFFF]">Product Image {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem("productGallery", i)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                  >
                    ✕ Remove
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Image</label>
                  <UploadBox
                    label="Upload Image"
                    value={item.image}
                    onUpload={(file) => handleGalleryImageUpload("productGallery", i, file)}
                  />
                  {item.image && (
                    <div className="mt-1">
                      <img src={item.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[#292C30]" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Product Name</label>
                  <input
                    className="input w-full"
                    value={item.name || ''}
                    onChange={(e) => updateGalleryItem("productGallery", i, "name", e.target.value)}
                    placeholder="Product name (optional)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Description</label>
                  <textarea
                    className="input w-full"
                    value={item.description || ''}
                    onChange={(e) => updateGalleryItem("productGallery", i, "description", e.target.value)}
                    placeholder="Product description (optional)"
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addGalleryItem("productGallery")}
              disabled={
                !isUnlimited(profileLimits?.productImages) &&
                directory.productGallery.length >= (getFeatureLimit(profileLimits?.productImages) ?? 0)
              }
              className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
            >
              + Add Product Image
              {!isUnlimited(profileLimits?.productImages) &&
                ` (${directory.productGallery.length}/${getDisplayLimit(profileLimits?.productImages)})`}
            </button>
          </div>
        </PlanGatedSection>
      </Section>

      {/* COMPANY GALLERY - GATED BY PACKAGE */}
      <Section title="Company Gallery">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.galleryImages)}
          upgradeMessage="Company Gallery is available on Basic plan and above."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {isUnlimited(profileLimits?.galleryImages)
              ? "Unlimited company images on your plan."
              : `Your plan allows up to ${getDisplayLimit(profileLimits?.galleryImages)} company images.`}
          </p>
          <div className="space-y-4">
            {directory.companyGallery.map((item: GalleryItem, i: number) => (
              <div key={i} className="p-4 border border-[#292C30] rounded-xl space-y-3 bg-[#171A1E] text-[#CCCCCC]">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#FFFFFF]">Company Image {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem("companyGallery", i)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                  >
                    ✕ Remove
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Image</label>
                  <UploadBox
                    label="Upload Image"
                    value={item.image}
                    onUpload={(file) => handleGalleryImageUpload("companyGallery", i, file)}
                  />
                  {item.image && (
                    <div className="mt-1">
                      <img src={item.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[#292C30]" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Image Name</label>
                  <input
                    className="input w-full"
                    value={item.name || ''}
                    onChange={(e) => updateGalleryItem("companyGallery", i, "name", e.target.value)}
                    placeholder="Image name (optional)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Description</label>
                  <textarea
                    className="input w-full"
                    value={item.description || ''}
                    onChange={(e) => updateGalleryItem("companyGallery", i, "description", e.target.value)}
                    placeholder="Image description (optional)"
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addGalleryItem("companyGallery")}
              disabled={
                !isUnlimited(profileLimits?.galleryImages) &&
                directory.companyGallery.length >= (getFeatureLimit(profileLimits?.galleryImages) ?? 0)
              }
              className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
            >
              + Add Company Image
              {!isUnlimited(profileLimits?.galleryImages) &&
                ` (${directory.companyGallery.length}/${getDisplayLimit(profileLimits?.galleryImages)})`}
            </button>
          </div>
        </PlanGatedSection>
      </Section>

      {/* FACTORY GALLERY - GATED BY PACKAGE */}
      <Section title="Factory Gallery">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.factoryImages)}
          upgradeMessage="Factory Gallery is available on Basic plan and above."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {isUnlimited(profileLimits?.factoryImages)
              ? "Unlimited factory images on your plan."
              : `Your plan allows up to ${getDisplayLimit(profileLimits?.factoryImages)} factory images.`}
          </p>
          <div className="space-y-4">
            {directory.factoryGallery.map((item: GalleryItem, i: number) => (
              <div key={i} className="p-4 border border-[#292C30] rounded-xl space-y-3 bg-[#171A1E] text-[#CCCCCC]">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-medium text-[#FFFFFF]">Factory Image {i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeGalleryItem("factoryGallery", i)}
                    className="text-rose-400 hover:text-rose-300 text-xs font-semibold"
                  >
                    ✕ Remove
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Image</label>
                  <UploadBox
                    label="Upload Image"
                    value={item.image}
                    onUpload={(file) => handleGalleryImageUpload("factoryGallery", i, file)}
                  />
                  {item.image && (
                    <div className="mt-1">
                      <img src={item.image} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-[#292C30]" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Image Name</label>
                  <input
                    className="input w-full"
                    value={item.name || ''}
                    onChange={(e) => updateGalleryItem("factoryGallery", i, "name", e.target.value)}
                    placeholder="Image name (optional)"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 text-[#CCCCCC]">Description</label>
                  <textarea
                    className="input w-full"
                    value={item.description || ''}
                    onChange={(e) => updateGalleryItem("factoryGallery", i, "description", e.target.value)}
                    placeholder="Image description (optional)"
                    rows={2}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addGalleryItem("factoryGallery")}
              disabled={
                !isUnlimited(profileLimits?.factoryImages) &&
                directory.factoryGallery.length >= (getFeatureLimit(profileLimits?.factoryImages) ?? 0)
              }
              className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
            >
              + Add Factory Image
              {!isUnlimited(profileLimits?.factoryImages) &&
                ` (${directory.factoryGallery.length}/${getDisplayLimit(profileLimits?.factoryImages)})`}
            </button>
          </div>
        </PlanGatedSection>
      </Section>

      {/* COMPANY BROCHURE - GATED BY PACKAGE */}
      <Section title="Company Brochure">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.brochures)}
          upgradeMessage="Company Brochure is available on Basic plan and above."
        >
          <GallerySection
            field="companyBrochure"
            items={directory.companyBrochure}
            onUpload={handleDocumentUpload}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            addLabel="+ Add brochure file"
            uploadLabel="Brochure File"
          />
        </PlanGatedSection>
      </Section>

      {/* CERTIFICATIONS - GATED BY PACKAGE */}
      <Section title="Certifications">
        <PlanGatedSection allowed={isFeatureAllowed(profileLimits?.certifications)}
          upgradeMessage="Certifications are available on Basic plan and above."
        >
          <GallerySection
            field="certifications"
            items={directory.certifications}
            onUpload={handleDocumentUpload}
            onAdd={addArrayItem}
            onRemove={removeArrayItem}
            addLabel="+ Add certification file"
            uploadLabel="Certification File"
          />
        </PlanGatedSection>
      </Section>

      {/* BRANDS REPRESENTED */}
      <Section title="Brands Represented">
        {(() => {
          const isUnlimitedBrands = isUnlimited(profileLimits?.brandsRepresented);
          const limit = getFeatureLimit(profileLimits?.brandsRepresented);

          if (!isFeatureAllowed(profileLimits?.brandsRepresented)) {
            return (
              <div className="rounded-xl border border-dashed border-[#292C30] bg-[#171A1E] p-4 text-sm text-[#B8B8B8]">
                Brands Represented are available on Basic plan and above.
                {isProfessionalOrEnterprise && " Your plan includes unlimited brands."}
              </div>
            );
          }

          return (
            <>
              <p className="text-xs text-[#B8B8B8] mb-2">
                {isUnlimitedBrands
                  ? "✅ Unlimited brands on your Professional/Enterprise plan."
                  : `Your plan allows up to ${limit} brands.`}
              </p>
              {directory.brandsRepresented.map((item: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="input flex-1"
                    value={item}
                    onChange={(e) => updateArrayItem("brandsRepresented", i, e.target.value)}
                    placeholder="Brand name"
                  />
                  {i > 0 && (
                    <button type="button" onClick={() => removeArrayItem("brandsRepresented", i)} className="text-rose-400 hover:text-rose-300 font-bold px-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("brandsRepresented")}
                disabled={!isUnlimitedBrands && directory.brandsRepresented.length >= (limit ?? 0)}
                className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
              >
                + Add Brand
                {!isUnlimitedBrands && limit !== null &&
                  ` (${directory.brandsRepresented.length}/${limit})`}
                {isUnlimitedBrands && " (Unlimited)"}
              </button>
            </>
          );
        })()}
      </Section>

      {/* INDUSTRIES SERVED */}
      <Section title="Industries Served">
        {(() => {
          const isUnlimitedIndustries = isUnlimited(profileLimits?.industriesServed);
          const limit = getFeatureLimit(profileLimits?.industriesServed);

          if (!isFeatureAllowed(profileLimits?.industriesServed)) {
            return (
              <div className="rounded-xl border border-dashed border-[#292C30] bg-[#171A1E] p-4 text-sm text-[#B8B8B8]">
                Industries Served are available on Free plan (limited to 5) and above.
              </div>
            );
          }

          return (
            <>
              <p className="text-xs text-[#B8B8B8] mb-2">
                {isUnlimitedIndustries
                  ? "✅ Unlimited industries on your Professional/Enterprise plan."
                  : `Your plan allows up to ${limit} industries.`}
              </p>
              {directory.industriesServed.map((item: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="input flex-1"
                    value={item}
                    onChange={(e) => updateArrayItem("industriesServed", i, e.target.value)}
                    placeholder="Industry name"
                  />
                  {i > 0 && (
                    <button type="button" onClick={() => removeArrayItem("industriesServed", i)} className="text-rose-400 hover:text-rose-300 font-bold px-2">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("industriesServed")}
                disabled={!isUnlimitedIndustries && directory.industriesServed.length >= (limit ?? 0)}
                className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
              >
                + Add Industry
                {!isUnlimitedIndustries && limit !== null &&
                  ` (${directory.industriesServed.length}/${limit})`}
                {isUnlimitedIndustries && " (Unlimited)"}
              </button>
            </>
          );
        })()}
      </Section>

      {/* EXPORT MARKETS - GATED BY PACKAGE */}
      <Section title="Export Markets">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.exportMarkets)}
          upgradeMessage="Export Markets are available on Basic plan and above."
        >
          {directory.exportMarkets.map((item: string, i: number) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                className="input flex-1"
                value={item}
                onChange={(e) => updateArrayItem("exportMarkets", i, e.target.value)}
                placeholder="Country name"
              />
              {i > 0 && (
                <button type="button" onClick={() => removeArrayItem("exportMarkets", i)} className="text-rose-400 hover:text-rose-300 font-bold px-2">
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("exportMarkets")}
            className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
          >
            + Add Country
          </button>
        </PlanGatedSection>
      </Section>

      {/* ============================================================================
          MANUFACTURING CAPABILITIES - WITH ENTERPRISE MEDIA SUPPORT
          ============================================================================ */}
      <Section title="Manufacturing Capabilities">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.manufacturingCapabilities)}
          upgradeMessage="Manufacturing Capabilities are available on Basic plan and above."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {typeof profileLimits?.manufacturingCapabilities === "string" && profileLimits.manufacturingCapabilities}
            {isEnterprise && " — Enterprise plan: Complete text + Photos + Videos."}
            {isProfessional && profileLimits?.manufacturingCapabilities === "Complete" && " — Professional plan: Complete text description."}
            {!isProfessional && !isEnterprise && profileLimits?.manufacturingCapabilities === "Basic" && " — Basic plan: Basic text description."}
          </p>

          {/* Rich Text Editor - Available for Professional and Enterprise */}
          {(isProfessional || isEnterprise) ? (
            <RichTextEditor
              value={directory.manufacturingCapabilities || ""}
              onChange={(val: string) =>
                setDirectory({ ...directory, manufacturingCapabilities: val })
              }
            />
          ) : (
            <textarea
              rows={5}
              className="input w-full"
              value={directory.manufacturingCapabilities || ""}
              onChange={(e) => setDirectory({ ...directory, manufacturingCapabilities: e.target.value })}
              placeholder="Describe your manufacturing capabilities..."
            />
          )}

          {/* ✅ Manufacturing Photos - Enterprise only */}
          {isEnterprise && (
            <div className="mt-4">
              <label className="font-medium text-sm block mb-1 text-[#FFFFFF]">Manufacturing Photos</label>
              <p className="text-xs text-[#B8B8B8] mb-2">
                Upload photos of your manufacturing capabilities (Unlimited on Enterprise)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {directory.manufacturingCapabilityImages?.map((url: string, i: number) => (
                  <div key={i} className="relative space-y-1">
                    <UploadBox
                      label={`Photo ${i + 1}`}
                      value={url}
                      onUpload={(file) => handleManufacturingImageUpload(i, file)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(directory.manufacturingCapabilityImages || [])];
                        arr.splice(i, 1);
                        setDirectory({ ...directory, manufacturingCapabilityImages: arr });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold mt-1"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
                <div className="col-span-full">
                  <button
                    type="button"
                    onClick={() => setDirectory({
                      ...directory,
                      manufacturingCapabilityImages: [...(directory.manufacturingCapabilityImages || []), ""]
                    })}
                    className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
                  >
                    + Add Photo
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ Manufacturing Videos - Enterprise only */}
          {isEnterprise && (
            <div className="mt-4">
              <label className="font-medium text-sm block mb-1 text-[#FFFFFF]">Manufacturing Videos</label>
              <p className="text-xs text-[#B8B8B8] mb-2">
                Add YouTube or Vimeo video URLs (Unlimited on Enterprise)
              </p>
              {directory.manufacturingCapabilityVideos?.map((url: string, i: number) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className="input flex-1"
                    value={url}
                    onChange={(e) => handleManufacturingVideoUpdate(i, e.target.value)}
                    placeholder="YouTube or Vimeo URL"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const arr = [...(directory.manufacturingCapabilityVideos || [])];
                      arr.splice(i, 1);
                      setDirectory({ ...directory, manufacturingCapabilityVideos: arr });
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold px-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setDirectory({
                  ...directory,
                  manufacturingCapabilityVideos: [...(directory.manufacturingCapabilityVideos || []), ""]
                })}
                className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
              >
                + Add Video
              </button>
            </div>
          )}

          {isEnterprise && (
            <div className="mt-2 p-3 bg-[#0073FF]/10 border border-[#0073FF]/30 rounded-xl">
              <p className="text-sm text-[#00B5ED]">
                <strong>Enterprise Feature:</strong> You can upload unlimited photos and videos
                to showcase your manufacturing capabilities.
              </p>
            </div>
          )}
        </PlanGatedSection>
      </Section>

      {/* ============================================================================
          MACHINERY LIST - WITH ENTERPRISE MEDIA SUPPORT
          ============================================================================ */}
      <Section title="Machinery List">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.machineryList)}
          upgradeMessage="Machinery List is available on Basic plan and above."
        >
          <p className="text-xs text-[#B8B8B8] mb-2">
            {typeof profileLimits?.machineryList === "string" && profileLimits.machineryList}
            {isEnterprise && " — Enterprise plan: Detailed text + Machinery Images."}
            {isProfessional && profileLimits?.machineryList === "Detailed" && " — Professional plan: Detailed text list."}
            {!isProfessional && !isEnterprise && profileLimits?.machineryList === "Basic" && " — Basic plan: Basic text list."}
          </p>

          {/* Rich Text Editor - Available for Professional and Enterprise */}
          {(isProfessional || isEnterprise) ? (
            <RichTextEditor
              value={directory.machineryList || ""}
              onChange={(val: string) => setDirectory({ ...directory, machineryList: val })}
            />
          ) : (
            <textarea
              rows={5}
              className="input w-full"
              value={directory.machineryList || ""}
              onChange={(e) => setDirectory({ ...directory, machineryList: e.target.value })}
              placeholder="List your machinery..."
            />
          )}

          {/* ✅ Machinery Images - Enterprise only */}
          {isEnterprise && (
            <div className="mt-4">
              <label className="font-medium text-sm block mb-1 text-[#FFFFFF]">Machinery Images</label>
              <p className="text-xs text-[#B8B8B8] mb-2">
                Upload images of your machinery (Unlimited on Enterprise)
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {directory.machineryImages?.map((url: string, i: number) => (
                  <div key={i} className="relative space-y-1">
                    <UploadBox
                      label={`Machine Image ${i + 1}`}
                      value={url}
                      onUpload={(file) => handleMachineryImageUpload(i, file)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const arr = [...(directory.machineryImages || [])];
                        arr.splice(i, 1);
                        setDirectory({ ...directory, machineryImages: arr });
                      }}
                      className="text-rose-400 hover:text-rose-300 text-xs font-semibold mt-1"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ))}
                <div className="col-span-full">
                  <button
                    type="button"
                    onClick={() => setDirectory({
                      ...directory,
                      machineryImages: [...(directory.machineryImages || []), ""]
                    })}
                    className="border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
                  >
                    + Add Machine Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {isEnterprise && (
            <div className="mt-2 p-3 bg-[#0073FF]/10 border border-[#0073FF]/30 rounded-xl">
              <p className="text-sm text-[#00B5ED]">
                <strong>Enterprise Feature:</strong> You can upload unlimited machinery images
                alongside your text descriptions.
              </p>
            </div>
          )}
        </PlanGatedSection>
      </Section>

      {/* QUALITY STANDARDS - GATED BY PACKAGE */}
      <Section title="Quality Standards">
        <PlanGatedSection
          allowed={isFeatureAllowed(profileLimits?.qualityStandards)}
          upgradeMessage="Quality Standards are available on Basic plan and above."
        >
          <RichTextEditor
            value={directory.qualityStandards}
            onChange={(val: string) => setDirectory({ ...directory, qualityStandards: val })}
          />
        </PlanGatedSection>
      </Section>

      {/* INQUIRY FORM */}
      <Section title="Inquiry Form">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={directory.enableInquiryForm ?? true}
            onChange={(e) =>
              setDirectory({ ...directory, enableInquiryForm: e.target.checked })
            }
          />
          <span>Enable inquiry form on public showroom page</span>
        </label>
      </Section>

      <button
        onClick={saveChanges}
        disabled={saving || uploadingCatalogue || uploadingGalleryImage}
        className="w-full bg-[#0073FF] hover:bg-[#0060D0] text-white px-6 py-3.5 rounded-xl font-semibold text-base transition shadow-md disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
  );
}

// ============================================================================
// Helper Components
// ============================================================================

function Section({ title, children }: any) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-[#FFFFFF] border-b border-[#292C30] pb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function GallerySection({
  field,
  items,
  onUpload,
  onAdd,
  onRemove,
  addLabel,
  uploadLabel = "File",
  max,
  allowRemoveFirst = false,
}: {
  field: string;
  items: string[];
  onUpload: (field: string, index: number, file: File) => void | Promise<void>;
  onAdd: (field: string) => void;
  onRemove: (field: string, index: number) => void;
  addLabel: string;
  uploadLabel?: string;
  max?: number | null;
  allowRemoveFirst?: boolean;
}) {
  const atLimit = max != null && items.length >= max;

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <UploadBox
            label={`${uploadLabel} ${i + 1}`}
            value={item}
            onUpload={async (file) => onUpload(field, i, file)}
          />
          {(i > 0 || allowRemoveFirst) && (
            <button type="button" onClick={() => onRemove(field, i)} className="text-rose-400 hover:text-rose-300 text-xs font-semibold mt-1">
              ✕ Remove
            </button>
          )}
        </div>
      ))}
      <div className="col-span-2">
        <button
          type="button"
          onClick={() => onAdd(field)}
          disabled={atLimit}
          className="disabled:opacity-40 disabled:cursor-not-allowed border border-[#292C30] px-4 py-2.5 rounded-xl bg-[#171A1E] text-[#00B5ED] hover:text-[#0073FF] hover:border-[#00B5ED]/40 text-sm font-semibold transition"
        >
          {addLabel}
          {max !== null && ` (${items.length}/${max})`}
        </button>
      </div>
    </div>
  );
}
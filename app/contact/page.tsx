"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { sendContactMessage, ContactFormData } from "@/lib/api/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    website: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await sendContactMessage(formData);

      if (response.success) {
        setSuccessMessage("Thank you! Your message has been sent successfully.");
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          website: "",
          message: "",
        });
        // Clear success message after 5 seconds
        setTimeout(() => setSuccessMessage(""), 5000);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message. Please try again."
      );
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const locations = [
    {
      title: "California",
      img: "/images/newyork.png",
      address: "Madison Avenue, New York",
      phone: "+990 123 456 789",
      email: "info@toolingtrends.com",
    },
    {
      title: "New York City",
      img: "/images/newyork.png",
      address: "Washington Ave, Manchester, Kentucky",
      phone: "+89 (308) 555-0121",
      email: "info@toolingtrends.com",
    },
    {
      title: "New Hampshire",
      img: "/images/newyork.png",
      address: "Parker Rd. Allentown, New Mexico",
      phone: "(907) 555-0101",
      email: "info@toolingtrends.com",
    },
  ];

  return (
    <main className="w-full bg-[#0c0d10] text-white">
      {/* ================= HERO / BREADCRUMB ================= */}
      <section className="relative bg-[#111318] py-24 text-center border-b border-white/5">
        <h1 className="text-4xl font-semibold text-white">Contact</h1>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#8b93a1]">
          <Link href="/" className="hover:text-blue-500 transition">
            Tooling Trends
          </Link>
          <span className="text-[#3d424c]">→</span>
          <span className="text-blue-500">Contact</span>
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="pt-16 pb-24">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {locations.map((item) => (
              <div
                key={item.title}
                className="bg-[#16181d] rounded-2xl overflow-hidden text-center"
              >
                <div className="relative w-full h-[260px]">
                  <Image
                    src={item.img}
                    alt={`${item.title} office`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-semibold text-white">
                    {item.title}
                  </h3>

                  {/* blue underline divider */}
                  <div className="w-10 h-[2px] bg-blue-500 mx-auto my-4" />

                  <p className="text-sm text-[#9aa0ab] leading-relaxed">
                    {item.address}
                  </p>
                  <p className="text-sm text-[#9aa0ab] mt-1">
                    {item.phone}
                  </p>
                  <p className="text-sm text-[#9aa0ab] mt-1">
                    {item.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM (overlaps the map below it) ================= */}
      <section className="relative z-10 pb-0">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="relative bg-[#16181d] rounded-2xl p-10 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 overflow-hidden">
            {/* blue top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-500" />

            {/* FORM */}
            <div>
              <h2 className="text-3xl font-semibold text-white mb-8">
                Feel Free to Contact Us
              </h2>

              {successMessage && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/40 text-green-400 rounded-lg">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-[#c7cbd3]">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Type Name"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] text-white placeholder:text-[#5b616c] px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-[#c7cbd3]">Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] text-white placeholder:text-[#5b616c] px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-[#c7cbd3]">Phone Number*</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(480) 555-0103"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] text-white placeholder:text-[#5b616c] px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm text-[#c7cbd3]">Website*</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="www.nerio.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] text-white placeholder:text-[#5b616c] px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-[#c7cbd3]">Message*</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Type here..."
                    className="mt-2 w-full rounded-lg border border-white/10 bg-[#0c0d10] text-white placeholder:text-[#5b616c] px-4 py-3.5 text-sm outline-none focus:border-blue-500 transition-colors resize-y"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5 rounded-lg text-sm font-medium hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 12" className="w-3.5 h-3.5 fill-white">
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.2079 5.0991C14.0115 5.0991 12.0097 3.0991 12.0097 0.900901V0H10.2079V0.900901C10.2079 2.4991 10.9088 3.9982 12.0088 5.0991H0.892578V6.9009H12.0088C10.9088 8.0018 10.2079 9.5009 10.2079 11.0991V12H12.0097V11.0991C12.0097 8.9018 14.0115 6.9009 16.2079 6.9009H17.1088V5.0991H16.2079Z" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* IMAGE */}
            <div className="relative w-full h-full min-h-[480px] rounded-2xl overflow-hidden">
              <Image
                src="/images/contact.png"
                alt="Customer support representative"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= MAP ================= */}
      <section>
        <div className="w-full h-[420px]">
          <iframe
            loading="lazy"
            className="w-full h-full border-0"
            src="https://maps.google.com/maps?q=London%2C%20westminstar&t=m&z=10&output=embed&iwloc=near"
            title="Office location map"
            aria-label="Office location map"
          />
        </div>
      </section>
    </main>
  );
}
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
    <main className="w-full bg-[#171A1E] text-white min-h-screen">
      {/* ================= HERO / BREADCRUMB ================= */}
      <section className="relative bg-gradient-to-r from-[#171A1E] via-[#1D2125] to-[#1D247B] py-20 text-center border-b border-[#292C30]">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white">Contact Us</h1>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#CCCCCC]">
          <Link href="/" className="hover:text-[#00B5ED] transition-colors">
            Tooling Trends
          </Link>
          <span className="text-[#858585]">→</span>
          <span className="text-[#00B5ED] font-semibold">Contact</span>
        </div>
      </section>

      {/* ================= LOCATIONS ================= */}
      <section className="pt-16 pb-20">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {locations.map((item) => (
              <div
                key={item.title}
                className="bg-[#1D2125] border border-[#292C30] rounded-2xl overflow-hidden text-center shadow-lg hover:border-[#0073FF]/50 transition-all duration-300"
              >
                <div className="relative w-full h-[240px] bg-[#171A1E]">
                  <Image
                    src={item.img}
                    alt={`${item.title} office`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-white">
                    {item.title}
                  </h3>

                  {/* cyan underline divider */}
                  <div className="w-12 h-[3px] bg-[#00B5ED] rounded-full mx-auto my-4" />

                  <p className="text-sm text-[#CCCCCC] leading-relaxed">
                    {item.address}
                  </p>
                  <p className="text-sm text-[#B8B8B8] mt-1.5 font-medium">
                    {item.phone}
                  </p>
                  <p className="text-sm text-[#00B5ED] mt-1 font-medium">
                    {item.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CONTACT FORM (Floats / Overlays on the Map below) ================= */}
      <section className="relative z-20 -mb-44 md:-mb-56 lg:-mb-64">
        <div className="max-w-[1320px] mx-auto px-6">
          <div className="relative bg-[#1D2125] border border-[#292C30] rounded-2xl p-8 md:p-12 lg:p-14 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 overflow-hidden shadow-2xl shadow-black/90">
            {/* blue/cyan top border accent */}
            <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-[#00B5ED] to-[#0073FF]" />

            {/* FORM */}
            <div>
              <h2 className="text-3xl font-extrabold text-white mb-2">
                Feel Free to Contact Us
              </h2>
              <p className="text-sm text-[#CCCCCC] mb-8">
                Have questions or need assistance? Send us a message and our team will get back to you shortly.
              </p>

              {successMessage && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-medium">
                  {successMessage}
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl text-sm font-medium">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold text-[#B8B8B8] uppercase tracking-wider">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Type Name"
                    className="mt-2 w-full rounded-xl border border-[#292C30] bg-[#171A1E] text-white placeholder:text-[#858585] px-4 py-3.5 text-sm outline-none focus:border-[#00B5ED] focus:ring-1 focus:ring-[#00B5ED] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#B8B8B8] uppercase tracking-wider">Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="info@example.com"
                    className="mt-2 w-full rounded-xl border border-[#292C30] bg-[#171A1E] text-white placeholder:text-[#858585] px-4 py-3.5 text-sm outline-none focus:border-[#00B5ED] focus:ring-1 focus:ring-[#00B5ED] transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#B8B8B8] uppercase tracking-wider">Phone Number*</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="(480) 555-0103"
                    className="mt-2 w-full rounded-xl border border-[#292C30] bg-[#171A1E] text-white placeholder:text-[#858585] px-4 py-3.5 text-sm outline-none focus:border-[#00B5ED] focus:ring-1 focus:ring-[#00B5ED] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#B8B8B8] uppercase tracking-wider">Website*</label>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="www.example.com"
                    className="mt-2 w-full rounded-xl border border-[#292C30] bg-[#171A1E] text-white placeholder:text-[#858585] px-4 py-3.5 text-sm outline-none focus:border-[#00B5ED] focus:ring-1 focus:ring-[#00B5ED] transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-[#B8B8B8] uppercase tracking-wider">Message*</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Type your message here..."
                    className="mt-2 w-full rounded-xl border border-[#292C30] bg-[#171A1E] text-white placeholder:text-[#858585] px-4 py-3.5 text-sm outline-none focus:border-[#00B5ED] focus:ring-1 focus:ring-[#00B5ED] transition-colors resize-y"
                    required
                  />
                </div>

                <div className="md:col-span-2 mt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#0073FF] hover:bg-[#0060d6] text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-lg shadow-[#0073FF]/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="relative w-full h-full min-h-[440px] rounded-xl overflow-hidden border border-[#292C30] bg-[#171A1E]">
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

      {/* ================= MAP (Tall Vertical Map with Form Overlay) ================= */}
      <section className="relative z-10 w-full pt-16">
        <div className="w-full h-[600px] md:h-[700px] lg:h-[800px] relative">
          <iframe
            loading="lazy"
            className="w-full h-full border-0 opacity-90 contrast-[1.05]"
            src="https://maps.google.com/maps?q=London%2C%20westminstar&t=m&z=10&output=embed&iwloc=near"
            title="Office location map"
            aria-label="Office location map"
          />
        </div>
      </section>
    </main>
  );
}
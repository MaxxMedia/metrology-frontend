"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface SubscribeFormValues {
  email: string;
  confirmEmail: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  country: string;
}

const initialValues: SubscribeFormValues = {
  email: "",
  confirmEmail: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  country: "",
};

const SubscribeSchema = Yup.object().shape({
  email: Yup.string().email("Invalid Email").required("Required"),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Emails must match")
    .required("Required"),
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  jobTitle: Yup.string().required("Required"),
  company: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
});

export default function SubscribePage() {
  const [countries, setCountries] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [countriesError, setCountriesError] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://cdn.jsdelivr.net/gh/umpirsky/country-list@master/data/en/country.json"
        );

        if (!res.ok) throw new Error("Failed to fetch countries");

        const data = (await res.json()) as Record<string, string>; // { "US": "United States", "IN": "India", ... }
        const names: string[] = Object.values(data).sort((a, b) => a.localeCompare(b));

        setCountries(names);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setCountriesError(true);
      } finally {
        setCountriesLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="w-full bg-white text-gray-900">

      {/* ⭐ SECTION 1 — HERO AREA */}
      <div className="max-w-[1400px] mx-auto px-10 pt-16 pb-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* LEFT AREA */}
        <div>
          <h1 className="text-6xl font-semibold leading-tight mb-8">
            Subscribe to Metrology
          </h1>

          <p className="text-gray-700 text-xl leading-relaxed mb-10 max-w-[650px]">
            Metrology magazine addresses the complete lifecycle of
            the manufacture and maintenance of a Tooling– from design to first shot –
            by providing solutions and strategies to Toolmaking professionals
            charged with designing, building and repairing molds.
          </p>

          <label className="flex items-center gap-3 mb-3 text-lg">
            <input type="checkbox" className="w-5 h-5" />
            Subscribe me to the <b><i>Metrology</i></b> magazine
          </label>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="flex justify-center items-start">
          <div className="relative w-full max-w-[400px] h-[350px]">
            <Image
              src="/recycled-materials-manufacturing.jpg"
              alt="Toolingmanufacturing process"
              fill
              className="object-contain"
              priority
              sizes="(max-width:768px) 100vw, 400px"
            />
          </div>
        </div>

      </div>

      {/* ⭐ SECTION 2 — FORM AREA */}
      <div className="w-full bg-white pb-10">
        <div className="max-w-[1400px] mx-auto px-10">

          <h2 className="text-4xl font-bold mb-6">Subscriber Information</h2>

          <Formik<SubscribeFormValues>
            initialValues={initialValues}
            validationSchema={SubscribeSchema}
            onSubmit={async (values, { resetForm }) => {

              const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              });

              if (res.ok) {
                resetForm();
                window.location.href = "/subscribe/thankyou";
              } else {
                alert("❌ Something went wrong. Try again later.");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-8">

                {/* Country Field — dynamic from API */}
                <div>
                  <Field
                    as="select"
                    name="country"
                    className="w-full border border-gray-400 rounded px-5 py-4 text-lg bg-white"
                    disabled={countriesLoading}
                  >
                    <option value="">
                      {countriesLoading
                        ? "Loading countries..."
                        : countriesError
                          ? "Failed to load countries"
                          : "Country*"}
                    </option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="country"
                    component="p"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Input Fields */}
                {[
                  { name: "email", placeholder: "Email Address*" },
                  { name: "confirmEmail", placeholder: "Confirm Email Address*" },
                  { name: "firstName", placeholder: "First Name*" },
                  { name: "lastName", placeholder: "Last Name*" },
                  { name: "jobTitle", placeholder: "Job Title*" },
                ].map((field) => (
                  <div key={field.name}>
                    <Field
                      name={field.name}
                      placeholder={field.placeholder}
                      className="w-full border border-gray-400 rounded px-5 py-4 text-lg"
                    />
                    <ErrorMessage
                      name={field.name}
                      component="p"
                      className="text-red-600 text-sm mt-1"
                    />
                  </div>
                ))}

                {/* Company Info */}
                <h2 className="text-4xl font-bold mt-12 mb-6">Company Information</h2>

                <div>
                  <Field
                    name="company"
                    placeholder="Company Name*"
                    className="w-full border border-gray-400 rounded px-5 py-4 text-lg"
                  />
                  <ErrorMessage
                    name="company"
                    component="p"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-center pt-10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#004d73] hover:bg-[#003a59] text-white text-xl font-bold px-16 py-4 rounded shadow-md"
                  >
                    Subscribe To Metrology
                  </button>
                </div>

              </Form>
            )}
          </Formik>

        </div>
      </div>

      {/* ⭐ SECTION 3 — FOOTER */}
      <div className="w-full text-center py-16 text-sm text-gray-600">
        <p>Your email address is used to communicate… etc.</p>
      </div>

    </div>
  );
}
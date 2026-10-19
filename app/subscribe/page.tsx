"use client"

import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import Link from "next/link"

interface SubscribeFormValues {
  magazineSubscription: boolean
  salutation: string
  email: string
  confirmEmail: string
  firstName: string
  lastName: string
  jobTitle: string
  company: string
  country: string
}

const initialValues: SubscribeFormValues = {
  magazineSubscription: false,
  salutation: "",
  email: "",
  confirmEmail: "",
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  country: "",
}

const SubscribeSchema = Yup.object({
  magazineSubscription: Yup.boolean(),
  salutation: Yup.string(),
  email: Yup.string().email("Enter a valid email address.").required("Email address is required."),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref("email")], "Email addresses must match.")
    .required("Please confirm your email address."),
  firstName: Yup.string().trim().required("First name is required."),
  lastName: Yup.string().trim().required("Last name is required."),
  jobTitle: Yup.string().trim().required("Job title is required."),
  company: Yup.string().trim().required("Company name is required."),
  country: Yup.string().required("Please select your country."),
})

const inputClassName =
  "mt-2 w-full rounded-lg border border-[#9bb6c8] bg-white px-4 py-3 text-[15px] text-[#152b3a] outline-none transition placeholder:text-[#7a8b96] focus:border-[#0073ff] focus:ring-2 focus:ring-[#0073ff]/15"

function FormField({
  name,
  label,
  type = "text",
  autoComplete,
}: {
  name: string
  label: string
  type?: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-semibold text-[#19384d]">
        {label} <span className="text-[#c63838]">*</span>
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        required
        aria-required="true"
        autoComplete={autoComplete}
        className={inputClassName}
      />
      <ErrorMessage name={name} component="p" className="mt-1.5 text-sm text-red-600" />
    </div>
  )
}

export default function SubscribePage() {
  const [countries, setCountries] = useState<string[]>(["India", "United States", "United Kingdom", "Canada", "Australia", "Germany", "Japan"])

  useEffect(() => {
    let cancelled = false
    fetch("https://cdn.jsdelivr.net/gh/umpirsky/country-list@master/data/en/country.json")
      .then((response) => {
        if (!response.ok) throw new Error("Country list unavailable")
        return response.json()
      })
      .then((data: Record<string, string>) => {
        if (!cancelled) setCountries(Object.values(data).sort((a, b) => a.localeCompare(b)))
      })
      .catch((error) => console.error("Could not load countries:", error))

    return () => { cancelled = true }
  }, [])

  return (
    <main className="min-h-screen bg-[#f3f7fa] text-[#152b3a]">
      <section className="relative overflow-hidden bg-[#082d46] text-white">
        <div className="absolute -right-20 -top-28 h-96 w-96 rounded-full border-[48px] border-white/[0.04]" />
        <div className="absolute -bottom-40 right-[20%] h-80 w-80 rounded-full bg-[#0073ff]/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center lg:gap-16 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#79caff]">The Metrology professional’s magazine</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Subscribe to Metrology 
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
              Metrology Trends magazine addresses the complete lifecycle of the manufacture and maintenance of Metrology, from design to first shot. Get practical solutions and strategies for professionals who design, build, and repair molds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold text-white/90">
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Mold design</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Toolmaking</span>
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Production insights</span>
            </div>
          </div>
          <div className="hidden rounded-2xl border border-white/15 bg-white/[0.06] p-7 shadow-2xl backdrop-blur-sm lg:block">
            <div className="flex aspect-[4/5] flex-col justify-between rounded-xl border border-white/15 bg-gradient-to-br from-[#0b4365] via-[#0b3048] to-[#061b29] p-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#79caff]">Metrology </p>
                <div className="mt-5 h-1 w-14 rounded bg-[#79caff]" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">From design</p>
                <p className="mt-2 text-3xl font-bold leading-tight">To the first shot.</p>
                <p className="mt-4 text-sm leading-6 text-white/70">Ideas and expertise for every stage of the Metrology lifecycle.</p>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">For the people who make it happen</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        <Formik<SubscribeFormValues>
          initialValues={initialValues}
          validationSchema={SubscribeSchema}
          onSubmit={async (values, { resetForm, setStatus }) => {
            setStatus(undefined)
            try {
              const response = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              })
              if (!response.ok) {
                const result = await response.json().catch(() => null)
                throw new Error(result?.error || "We could not process your subscription. Please try again.")
              }
              resetForm()
              window.location.assign("/subscribe/thankyou")
            } catch (error) {
              setStatus(error instanceof Error ? error.message : "Something went wrong. Please try again.")
            }
          }}
        >
          {({ isSubmitting, status }) => (
            <Form noValidate className="overflow-hidden rounded-2xl border border-[#d9e4eb] bg-white shadow-[0_12px_40px_rgba(10,46,69,0.08)]">
              <div className="border-b border-[#e5edf2] px-6 py-6 sm:px-10">
                <label className="flex cursor-pointer items-start gap-3">
                  <Field
                    type="checkbox"
                    name="magazineSubscription"
                    className="mt-1 h-5 w-5 rounded border-[#8aa8ba] accent-[#0073ff] focus:ring-[#0073ff]"
                  />
                  <span>
                    <span className="block font-semibold text-[#19384d]">Subscribe me to the Metrology  magazine</span>
                    <span className="mt-1 block text-sm leading-6 text-[#647481]">Receive magazine updates and information about your subscription.</span>
                  </span>
                </label>
              </div>

              <div className="space-y-8 px-6 py-7 sm:px-10 sm:py-9">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0073ff]">Your details</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#12364e]">Subscriber information</h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="salutation" className="text-sm font-semibold text-[#19384d]">Title</label>
                    <Field as="select" id="salutation" name="salutation" className={inputClassName}>
                      <option value="">Select a title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                    </Field>
                  </div>
                  <FormField name="firstName" label="First name" autoComplete="given-name" />
                  <FormField name="lastName" label="Last name" autoComplete="family-name" />
                  <FormField name="email" label="Email address" type="email" autoComplete="email" />
                  <FormField name="confirmEmail" label="Confirm email address" type="email" autoComplete="email" />
                  <FormField name="jobTitle" label="Job title" autoComplete="organization-title" />
                </div>

                <div className="border-t border-[#e5edf2] pt-7">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0073ff]">Your workplace</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#12364e]">Company information</h2>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <FormField name="company" label="Company name" autoComplete="organization" />
                    <div>
                      <label htmlFor="country" className="text-sm font-semibold text-[#19384d]">
                        Country <span className="text-[#c63838">*</span>
                      </label>
                      <Field as="select" id="country" name="country" autoComplete="country-name" required aria-required="true" className={inputClassName}>
                        <option value="">Select your country</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="country" component="p" className="mt-1.5 text-sm text-red-600" />
                    </div>
                  </div>
                </div>

                {status && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{status}</p>
                )}

                <div className="border-t border-[#e5edf2] pt-6">
                  <p className="text-sm leading-6 text-[#647481]">Your email address is used to communicate with you about your subscription.</p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-[#0073ff] px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-[#005fd1] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-64"
                  >
                    {isSubmitting ? "Submitting…" : "Subscribe to Metrology Trends"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <p className="mt-6 text-center text-sm text-[#647481]">
          Already subscribed? <Link href="/" className="font-semibold text-[#006be6] hover:underline">Return to Metrology</Link>
        </p>
      </section>
    </main>
  )
}

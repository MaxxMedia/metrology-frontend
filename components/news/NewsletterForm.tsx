"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

// Step 1: Personal Info Validation
const Step1Schema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  company: Yup.string().required("Company is required"),
})

// Step 2: Email Validation
const Step2Schema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
})

// Full Schema for final validation
const FullSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  company: Yup.string().required("Company is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
})

interface NewsletterFormProps {
  hasNewsletterContent?: boolean
}

export default function NewsletterForm({ hasNewsletterContent = true }: NewsletterFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
  })

  const handleNext = (values: typeof formData) => {
    setFormData(values)
    setStep(2)
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = async (values: typeof formData, { setSubmitting, resetForm }: any) => {
    try {
      const subscriberData = {
        fullName: `${values.firstName} ${values.lastName}`,
        email: values.email,
        companyName: values.company,
        frequency: "MONTHLY",
        emailSubscribed: true,
        whatsappSubscribed: false,
        smsSubscribed: false,
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscriberData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Subscription failed")
      }

      const token = localStorage.getItem("token")
      const userRole = localStorage.getItem("userRole")

      if (token && userRole === "admin") {
        router.push("/admin/newsletter/subscribers?subscribed=true")
        return
      }

      setIsSubmitted(true)

      setTimeout(() => {
        setIsSubmitted(false)
        resetForm()
        setStep(1)
        setFormData({
          firstName: "",
          lastName: "",
          company: "",
          email: "",
        })
      }, 5000)

    } catch (error: any) {
      console.error("Submission error:", error)
      alert(error.message || "Failed to subscribe. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // Success Message
  if (isSubmitted) {
    return (
      <section className="max-w-[1320px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-16 items-center">
          <div>
            <div className="relative w-full h-[380px]">
              <Image
                src="/images/moldnews.png"
                alt="TOOLING Newsletter"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 360px"
                priority
              />
            </div>
          </div>

          <div className="bg-[#1D2125] border border-emerald-500/40 rounded-[12px] p-8 text-center shadow-xl">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Successfully Subscribed!
            </h3>
            <p className="text-[#CCCCCC]">
              Thank you for subscribing to Metrology Newsletters.
            </p>
            <p className="text-sm text-[#B8B8B8] mt-2">
              You'll receive the latest updates from the Measurement and Inspection industry.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-[1320px] mx-auto px-6 py-12 my-6 bg-[#1D2125] border border-[#292C30] rounded-[12px] shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-center">

        {/* LEFT IMAGE */}
        <div>
          <div className="relative w-full h-[380px]">
            <Image
              src="/images/moldnews.png"
              alt="TOOLING Newsletter"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 360px"
              priority
            />
          </div>
        </div>

        {/* FORM */}
        <div>
          <h2 className="text-[32px] font-bold text-white mb-4">
            Subscribe to Metrology Newsletters
          </h2>

          <p className="text-[#CCCCCC] mb-8 leading-relaxed">
            Metrology Technology magazine is devoted to the Measurement and Inspection industry.
            Find out the processes and strategies shops around the world use to
            become more effective and efficient.
          </p>

          {/* ============ CONDITIONAL PAGINATION ============ */}
          {hasNewsletterContent ? (
            <>
              {/* Step Indicator */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 1 ? 'bg-[#0073FF] text-white' : 'bg-[#00B5ED] text-white'
                  }`}>
                    {step === 1 ? '1' : '✓'}
                  </div>
                  <span className={`text-sm ${step === 1 ? 'font-semibold text-white' : 'text-[#B8B8B8]'}`}>
                    Personal Info
                  </span>
                </div>

                <div className="w-12 h-0.5 bg-[#292C30]" />

                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === 2 ? 'bg-[#0073FF] text-white' : 'bg-[#171A1E] border border-[#292C30] text-[#858585]'
                  }`}>
                    2
                  </div>
                  <span className={`text-sm ${step === 2 ? 'font-semibold text-white' : 'text-[#B8B8B8]'}`}>
                    Email
                  </span>
                </div>
              </div>

              <Formik
                initialValues={formData}
                validationSchema={step === 1 ? Step1Schema : Step2Schema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ values, isSubmitting, validateForm, setTouched }) => (
                  <Form>
                    {step === 1 && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Field
                              name="firstName"
                              placeholder="First Name"
                              className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                            />
                            <ErrorMessage
                              name="firstName"
                              component="p"
                              className="text-red-400 text-xs mt-1 font-medium"
                            />
                          </div>

                          <div>
                            <Field
                              name="lastName"
                              placeholder="Last Name"
                              className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="p"
                              className="text-red-400 text-xs mt-1 font-medium"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <Field
                              name="company"
                              placeholder="Company"
                              className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                            />
                            <ErrorMessage
                              name="company"
                              component="p"
                              className="text-red-400 text-xs mt-1 font-medium"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            type="button"
                            onClick={async () => {
                              const errors = await validateForm()
                              if (Object.keys(errors).length === 0) {
                                handleNext(values)
                              } else {
                                setTouched({
                                  firstName: true,
                                  lastName: true,
                                  company: true,
                                })
                              }
                            }}
                            className="bg-[#0073FF] text-white px-10 py-3 font-bold rounded-[10px] hover:bg-[#0060df] transition-colors shadow-md"
                          >
                            Next Step →
                          </button>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="space-y-6">
                          <div className="bg-[#171A1E] border border-[#292C30] p-4 rounded-[10px] text-sm text-[#CCCCCC]">
                            <p><strong className="text-white">Name:</strong> {values.firstName} {values.lastName}</p>
                            <p><strong className="text-white">Company:</strong> {values.company}</p>
                          </div>

                          <div>
                            <Field
                              name="email"
                              type="email"
                              placeholder="Email Address"
                              className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                            />
                            <ErrorMessage
                              name="email"
                              component="p"
                              className="text-red-400 text-xs mt-1 font-medium"
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex gap-4">
                          <button
                            type="button"
                            onClick={handleBack}
                            className="bg-[#171A1E] border border-[#292C30] text-[#CCCCCC] px-8 py-3 font-bold rounded-[10px] hover:bg-[#292C30] hover:text-white transition-colors"
                          >
                            ← Back
                          </button>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#0073FF] text-white px-10 py-3 font-bold rounded-[10px] hover:bg-[#0060df] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              'Submit'
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </Form>
                )}
              </Formik>
            </>
          ) : (
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                company: "",
                email: "",
              }}
              validationSchema={FullSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <Field
                      name="firstName"
                      placeholder="First Name"
                      className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="p"
                      className="text-red-400 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <Field
                      name="lastName"
                      placeholder="Last Name"
                      className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="p"
                      className="text-red-400 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <Field
                      name="company"
                      placeholder="Company"
                      className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                    />
                    <ErrorMessage
                      name="company"
                      component="p"
                      className="text-red-400 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div>
                    <Field
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-[#171A1E] border border-[#292C30] text-white placeholder:text-[#858585] px-4 py-3 rounded-[10px] focus:outline-none focus:border-[#0073FF] focus:ring-1 focus:ring-[#0073FF] transition-colors"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-400 text-xs mt-1 font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#0073FF] text-white px-10 py-3 font-bold rounded-[10px] hover:bg-[#0060df] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>

                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </section>
  )
}
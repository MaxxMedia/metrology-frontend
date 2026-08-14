// components/QuteRequestForm.tsx
"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Send, CheckCircle2 } from "lucide-react"

type QuoteRequestButtonProps = {
    supplierSlug: string
    supplierName: string
    className?: string
}

type FormState = {
    fullName: string
    email: string
    phone: string
    companyName: string
    message: string
}

const initialForm: FormState = {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    message: "",
}

export default function QuoteRequestButton({
    supplierSlug,
    supplierName,
    className,
}: QuoteRequestButtonProps) {
    const [open, setOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [form, setForm] = useState<FormState>(initialForm)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Lock background scroll while modal is open
    useEffect(() => {
        if (open) {
            const original = document.body.style.overflow
            document.body.style.overflow = "hidden"
            return () => {
                document.body.style.overflow = original
            }
        }
    }, [open])

    function updateField(field: keyof FormState, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    function closeModal() {
        setOpen(false)
        setError("")
        if (success) {
            setSuccess(false)
            setForm(initialForm)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError("")

        if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
            setError("Please fill in your name, email and requirement.")
            return
        }

        try {
            setSubmitting(true)

            // ✅ FIX: Use the correct endpoint - /quote-request not /inquiries
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/suppliers/${supplierSlug}/quote-request`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: form.fullName,
                        email: form.email,
                        phoneNumber: form.phone,
                        companyName: form.companyName,
                        message: form.message,
                    }),
                }
            )

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.message || data.error || "Failed to send your request. Please try again.")
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "Failed to send your request. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const inputClass =
        "mt-1 w-full border border-[#292C30] bg-[#171A1E] text-white rounded-lg px-3 py-2 text-sm placeholder:text-gray-500 outline-none focus:border-[#0073FF] focus:ring-2 focus:ring-[#0073FF]/25"

    const modalContent = open && (
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 overflow-y-auto backdrop-blur-sm"
            onClick={closeModal}
        >
            <div
                className="bg-[#1D2125] border border-[#292C30] w-full max-w-md rounded-xl shadow-xl relative my-8 max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation()
                        closeModal()
                    }}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 text-gray-400 hover:text-white rounded-full p-1.5"
                    aria-label="Close"
                >
                    <X size={20} />
                </button>

                <div className="p-5 sm:p-6">
                    {success ? (
                        <div className="text-center py-6">
                            <CheckCircle2 className="mx-auto text-emerald-400" size={40} />
                            <h3 className="mt-4 text-lg font-semibold text-white">
                                Request sent
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                                {supplierName} will get back to you directly at the email
                                you provided.
                            </p>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    closeModal()
                                }}
                                className="mt-6 bg-[#0073FF] text-white px-6 py-2 text-sm font-semibold uppercase rounded-lg hover:bg-[#0060D0] transition"
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-lg font-semibold text-white pr-8">
                                Request a Quote
                            </h3>
                            <p className="mt-1 text-sm text-gray-400">
                                Send your requirement to {supplierName}. They&apos;ll reply
                                directly to your email.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                                <div>
                                    <label className="text-xs font-semibold text-[#CCCCCC] uppercase">
                                        Full Name
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.fullName}
                                        onChange={(e) => updateField("fullName", e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs font-semibold text-[#CCCCCC] uppercase">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className={inputClass}
                                            value={form.email}
                                            onChange={(e) => updateField("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-[#CCCCCC] uppercase">
                                            Phone
                                        </label>
                                        <input
                                            className={inputClass}
                                            value={form.phone}
                                            onChange={(e) => updateField("phone", e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#CCCCCC] uppercase">
                                        Company Name
                                    </label>
                                    <input
                                        className={inputClass}
                                        value={form.companyName}
                                        onChange={(e) => updateField("companyName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-[#CCCCCC] uppercase">
                                        What do you need?
                                    </label>
                                    <textarea
                                        rows={4}
                                        className={inputClass}
                                        value={form.message}
                                        onChange={(e) => updateField("message", e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className="text-sm text-red-400">{error}</p>}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full inline-flex items-center justify-center gap-2 bg-[#0073FF] text-white px-6 py-2.5 text-sm font-semibold uppercase rounded-lg hover:bg-[#0060D0] transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send size={16} />
                                    {submitting ? "Sending..." : "Send Request"}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    className ||
                    "inline-flex items-center justify-center gap-2 bg-[#0073FF] text-white px-5 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide hover:bg-[#0060D0] transition rounded-lg whitespace-nowrap"
                }
            >
                Request a Quote
            </button>

            {mounted && modalContent && createPortal(modalContent, document.body)}
        </>
    )
}
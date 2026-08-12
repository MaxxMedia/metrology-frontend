import AuthHero from "@/components/AuthHero"
import SignupForm from "@/components/SignupForm"
import Image from "next/image"
import { Suspense } from "react"

export default function SignupPage() {
  return (
    <div className="bg-[#141719]">
      <AuthHero title="Sign Up" />

      <section className="py-16 md:py-24 bg-[#1D2125]">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#16181d] rounded-2xl shadow-2xl border border-white/5 overflow-hidden">

            {/* LEFT – FORM */}
            <div className="flex items-center justify-center px-10 py-14">
              <Suspense fallback={<div className="text-white/50">Loading...</div>}>
                <SignupForm />
              </Suspense>
            </div>

            {/* RIGHT – IMAGE, full image, no overlay */}
            <div className="hidden lg:block relative">
              <Image
                src="/images/login.png"
                alt="Signup"
                fill
                priority
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
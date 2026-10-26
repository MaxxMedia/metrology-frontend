/** Implements the reset password page and its route-specific behavior. */
import AuthHero from "@/components/AuthHero"
import ResetPasswordForm from "@/components/ResetPasswordForm"
import Image from "next/image"
import { Suspense } from "react"

/** Renders the reset password page interface. */
export default function ResetPasswordPage() {
  return (
    <>
      <AuthHero title="Reset Password" />

      <section className="py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[20px] shadow-xl overflow-hidden">

            <div className="flex items-center justify-center p-14">
              {/* ✅ WRAP WITH SUSPENSE */}
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
              </Suspense>
            </div>

            <div className="hidden lg:block relative">
              <Image
                src="/images/login.png"
                alt="Reset"
                fill
                className="object-cover"
              />
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

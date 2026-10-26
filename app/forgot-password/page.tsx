/** Implements the forgot password page and its route-specific behavior. */
import AuthHero from "@/components/AuthHero"
import ForgotPasswordForm from "@/components/ForgotPasswordForm"
import Image from "next/image"

/** Renders the forgot password page interface. */
export default function ForgotPasswordPage() {
  return (
    <>
      <AuthHero title="Forgot Password" />

      <section className="py-28">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[20px] shadow-xl overflow-hidden">

            {/* LEFT */}
            <div className="flex items-center justify-center p-14">
              <ForgotPasswordForm />
            </div>

            {/* RIGHT IMAGE */}
            <div className="hidden lg:block relative">
              <Image
                src="/images/login.png"
                alt="Forgot Password"
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

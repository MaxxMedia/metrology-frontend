import AuthHero from "@/components/AuthHero";
import LoginForm from "@/components/LoginForm";
import Image from "next/image";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirect?: string;
    role?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <>
      <AuthHero title="Login" />

      <section className="py-16 md:py-24 bg-[#1D2125]">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#16181d] rounded-2xl shadow-2xl border border-white/5 overflow-hidden">

            {/* FORM SIDE */}
            <div className="flex items-center justify-center px-8 py-12 sm:px-12 sm:py-16">
              <div className="w-full max-w-[380px]">
                <LoginForm
                  {...({ redirect: params.redirect, role: params.role } as any)}
                />
              </div>
            </div>

            {/* IMAGE SIDE — full image, no overlay */}
            <div className="hidden lg:block relative min-h-[560px]">
              <Image
                src="/images/login.png"
                alt="Login"
                fill
                className="object-cover"
                priority
              />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
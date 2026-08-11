"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/admin/dashboard");
      } else setError(data.message || "Invalid credentials");
    } catch {
      setLoading(false);
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1D2125] px-4">
      <div className="max-w-md w-full bg-[#15171f] rounded-[8px] border border-white/10 shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">Admin Login</h2>
        <p className="text-center text-sm text-[#8a8b93] mb-6">Tooling Trends</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            className="w-full p-3 rounded-[4px] bg-[#111318] border border-white/10 text-white placeholder:text-[#8a8b93] focus:outline-none focus:border-[#0073ff]"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            className="w-full p-3 rounded-[4px] bg-[#111318] border border-white/10 text-white placeholder:text-[#8a8b93] focus:outline-none focus:border-[#0073ff]"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-[4px] text-white font-semibold transition-colors ${
              loading ? "bg-[#0073ff]/50" : "bg-[#0073ff] hover:bg-[#0060d6]"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

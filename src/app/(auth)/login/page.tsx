"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 bg-surface grayscale max-md:hidden" />
      <div className="w-[480px] max-md:w-full flex flex-col justify-center px-[60px] max-md:px-gutter-mobile py-10">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <span className="block w-[10px] h-[10px] bg-accent shrink-0" />
          <span className="text-[17px] font-[800] tracking-[-0.02em]">CellCraze</span>
        </Link>

        <h1 className="text-[40px] mb-2">Sign in</h1>
        <p className="text-[15px] text-muted mb-8">
          Welcome back. Sign in to your account.
        </p>

        {error && (
          <div className="bg-accent-100 text-accent-700 text-[13px] px-4 py-3 mb-6 border-l-2 border-accent">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-[13px] text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button size="lg" block type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="text-[14px] text-muted mt-8 text-center">
          Don&rsquo;t have an account?{" "}
          <Link href="/register" className="text-accent font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-bg">
      <div className="max-w-[400px] w-full mt-[120px] px-gutter-mobile">
        <Link href="/" className="flex items-center gap-2 mb-12">
          <span className="block w-[10px] h-[10px] bg-accent shrink-0" />
          <span className="text-[17px] font-[800] tracking-[-0.02em]">CellCraze</span>
        </Link>

        {submitted ? (
          <div>
            <h1 className="text-[32px] font-[800] mb-2">Check your email</h1>
            <p className="text-[15px] text-muted mb-8">
              We sent a password reset link to{" "}
              <span className="text-ink font-semibold">{email}</span>. Check your
              inbox and follow the instructions.
            </p>
            <Link
              href="/login"
              className="text-[14px] text-accent font-semibold hover:underline"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[32px] font-[800] mb-2">Forgot Password</h1>
            <p className="text-[15px] text-muted mb-8">
              Enter your email and we&rsquo;ll send you a reset link.
            </p>

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
              <Button size="lg" block type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send reset link"}
              </Button>
            </form>

            <p className="text-[14px] text-muted mt-8 text-center">
              Remember your password?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

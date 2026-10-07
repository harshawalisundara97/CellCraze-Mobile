"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
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
            <h1 className="text-[32px] font-[800] mb-2">Password reset successfully</h1>
            <p className="text-[15px] text-muted mb-8">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="text-[14px] text-accent font-semibold hover:underline"
            >
              Go to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-[32px] font-[800] mb-2">Reset Password</h1>
            <p className="text-[15px] text-muted mb-8">
              Enter your new password below.
            </p>

            {error && (
              <div className="bg-accent-100 text-accent-700 text-[13px] px-4 py-3 mb-6 border-l-2 border-accent">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  New password
                </label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Min 8 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Confirm password
                </label>
                <Input
                  type="password"
                  value={form.confirm}
                  onChange={update("confirm")}
                  placeholder="Re-enter password"
                  required
                />
              </div>
              <Button size="lg" block type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset password"}
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

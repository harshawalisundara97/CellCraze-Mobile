"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong");
      setLoading(false);
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

        <h1 className="text-[40px] mb-2">Create account</h1>
        <p className="text-[15px] text-muted mb-8">
          Join CellCraze to start shopping.
        </p>

        {error && (
          <div className="bg-accent-100 text-accent-700 text-[13px] px-4 py-3 mb-6 border-l-2 border-accent">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: "Full name", field: "name", type: "text", placeholder: "Kasun Perera" },
            { label: "Email", field: "email", type: "email", placeholder: "you@example.com" },
            { label: "Phone", field: "phone", type: "tel", placeholder: "+94 77 123 4567" },
            { label: "Password", field: "password", type: "password", placeholder: "Min 8 characters" },
            { label: "Confirm password", field: "confirmPassword", type: "password", placeholder: "Re-enter password" },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                {label}
              </label>
              <Input
                type={type}
                value={(form as any)[field]}
                onChange={update(field)}
                placeholder={placeholder}
                required
              />
            </div>
          ))}
          <Button size="lg" block type="submit" disabled={loading} className="mt-2">
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="text-[14px] text-muted mt-8 text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

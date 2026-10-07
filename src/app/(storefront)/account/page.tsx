"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AccountPage() {
  const [profile, setProfile] = useState({
    name: "Kasun Perera",
    email: "kasun@example.com",
    phone: "+94 77 123 4567",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [saved, setSaved] = useState(false);

  const updateProfile = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setProfile((prev) => ({ ...prev, [field]: e.target.value }));

  const updatePassword = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setPasswords((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-[40px] max-md:px-gutter-mobile">
      <nav className="py-3 text-[13px] text-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-ink font-semibold">Account</span>
      </nav>

      <h1 className="text-[56px] max-md:text-[36px] mb-2">Account</h1>
      <p className="text-[15px] text-muted mb-8">Manage your profile and password.</p>

      <div className="max-w-[640px] mx-auto">
        <form onSubmit={handleSave} className="flex flex-col gap-8">
          {/* Profile section */}
          <div className="rule-top pt-6">
            <h2 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-5">
              Profile
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Full name
                </label>
                <Input
                  type="text"
                  value={profile.name}
                  onChange={updateProfile("name")}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={profile.email}
                  disabled
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Phone
                </label>
                <Input
                  type="tel"
                  value={profile.phone}
                  onChange={updateProfile("phone")}
                  placeholder="+94 77 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Change Password section */}
          <div className="rule-top pt-6">
            <h2 className="text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-5">
              Change Password
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Current password
                </label>
                <Input
                  type="password"
                  value={passwords.current}
                  onChange={updatePassword("current")}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  New password
                </label>
                <Input
                  type="password"
                  value={passwords.newPassword}
                  onChange={updatePassword("newPassword")}
                  placeholder="Min 8 characters"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-2">
                  Confirm new password
                </label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={updatePassword("confirm")}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          </div>

          <div className="rule-top pt-6 flex items-center gap-4">
            <Button size="lg" type="submit">
              Save changes
            </Button>
            {saved && (
              <span className="text-[13px] text-accent font-semibold">Changes saved</span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

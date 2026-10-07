"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";

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
    <Box className="min-h-screen flex">
      <Box className="flex-1 max-md:hidden" sx={{ bgcolor: "background.paper", filter: "grayscale(1)" }} />
      <Paper
        elevation={0}
        className="flex flex-col justify-center"
        sx={{ width: { xs: "100%", md: 480 }, px: { xs: 2, md: "60px" }, py: 5 }}
      >
        <Box component={Link} href="/" className="flex items-center gap-2 mb-12" sx={{ textDecoration: "none", color: "inherit" }}>
          <Box sx={{ width: 10, height: 10, bgcolor: "primary.main", flexShrink: 0 }} />
          <Typography sx={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.02em" }}>CellCraze</Typography>
        </Box>

        <Typography variant="h1" sx={{ fontSize: "40px", mb: 1 }}>Create account</Typography>
        <Typography variant="body2" sx={{ fontSize: "15px", mb: 4 }}>
          Join CellCraze to start shopping.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { label: "Full name", field: "name", type: "text", placeholder: "Kasun Perera" },
            { label: "Email", field: "email", type: "email", placeholder: "you@example.com" },
            { label: "Phone", field: "phone", type: "tel", placeholder: "+94 77 123 4567" },
            { label: "Password", field: "password", type: "password", placeholder: "Min 8 characters" },
            { label: "Confirm password", field: "confirmPassword", type: "password", placeholder: "Re-enter password" },
          ].map(({ label, field, type, placeholder }) => (
            <TextField
              key={field}
              label={label}
              type={type}
              value={(form as any)[field]}
              onChange={update(field)}
              placeholder={placeholder}
              required
              fullWidth
              size="small"
            />
          ))}
          <Button variant="contained" size="large" fullWidth type="submit" disabled={loading} sx={{ mt: 1 }}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", fontSize: "14px" }}>
          Already have an account?{" "}
          <MuiLink component={Link} href="/login" underline="hover" sx={{ fontWeight: 600, color: "primary.main" }}>
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}

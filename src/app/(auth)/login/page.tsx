"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiLink from "@mui/material/Link";
import Alert from "@mui/material/Alert";

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

        <Typography variant="h1" sx={{ fontSize: "40px", mb: 1 }}>Sign in</Typography>
        <Typography variant="body2" sx={{ fontSize: "15px", mb: 4 }}>
          Welcome back. Sign in to your account.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            fullWidth
            size="small"
          />
          <Box className="flex justify-end">
            <MuiLink component={Link} href="/forgot-password" underline="hover" sx={{ fontSize: "13px", color: "primary.main" }}>
              Forgot password?
            </MuiLink>
          </Box>
          <Button variant="contained" size="large" fullWidth type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 4, textAlign: "center", fontSize: "14px" }}>
          Don&rsquo;t have an account?{" "}
          <MuiLink component={Link} href="/register" underline="hover" sx={{ fontWeight: 600, color: "primary.main" }}>
            Create one
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
}

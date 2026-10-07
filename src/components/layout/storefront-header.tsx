"use client";

import Link from "next/link";
import {
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Badge,
  Button,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import { Logo } from "./logo";

const utilityMessages = [
  "Free delivery over Rs 10,000",
  "Cash on delivery available",
  "Official warranty on every device",
];

const categories = [
  { name: "Phones", href: "/categories/phones" },
  { name: "Headphones", href: "/categories/headphones" },
  { name: "Earphones", href: "/categories/earphones" },
  { name: "Chargers", href: "/categories/chargers" },
  { name: "Smartwatches", href: "/categories/smartwatches" },
  { name: "Accessories", href: "/categories/accessories" },
];

export function StorefrontHeader() {
  const cartCount = 0;

  return (
    <Box component="header">
      {/* Utility bar */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          bgcolor: "secondary.main",
          color: "secondary.contrastText",
          fontSize: 12,
          px: 5,
          py: 1,
          gap: 4,
        }}
      >
        {utilityMessages.map((msg) => (
          <Typography key={msg} variant="body2" sx={{ fontSize: 12, color: "inherit" }}>
            {msg}
          </Typography>
        ))}
        <Typography
          component={Link}
          href="/orders/track"
          variant="body2"
          sx={{
            ml: "auto",
            fontSize: 12,
            color: "inherit",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          Track your order
        </Typography>
      </Box>

      {/* Main bar -- desktop */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          display: { xs: "none", md: "flex" },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar
          disableGutters
          sx={{
            display: "grid",
            gridTemplateColumns: "220px 1fr auto",
            gap: 4,
            px: 5,
            py: 2.25,
            minHeight: "auto !important",
          }}
        >
          <Logo />

          <TextField
            placeholder="Search phones, accessories..."
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                  </InputAdornment>
                ),
                sx: { fontSize: 14, height: 42 },
              },
            }}
          />

          <Box className="flex items-center gap-3">
            <Button
              component={Link}
              href="/account"
              startIcon={<PersonOutlineIcon sx={{ fontSize: 18 }} />}
              sx={{
                color: "text.primary",
                fontSize: 14,
                fontWeight: 600,
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              Sign in
            </Button>

            <IconButton
              component={Link}
              href="/account/wishlist"
              aria-label="Wishlist"
              sx={{ color: "text.primary" }}
            >
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            </IconButton>

            <Button
              component={Link}
              href="/cart"
              variant="contained"
              startIcon={<ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />}
              sx={{ fontWeight: 800, fontSize: 14, px: 2, minHeight: 36 }}
            >
              Cart
              <Badge
                badgeContent={cartCount}
                showZero
                sx={{
                  ml: 1.5,
                  "& .MuiBadge-badge": {
                    position: "static",
                    transform: "none",
                    bgcolor: "background.paper",
                    color: "text.primary",
                    fontSize: 11,
                    fontWeight: 800,
                    minWidth: 18,
                    height: 18,
                  },
                }}
              />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main bar -- mobile */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          display: { xs: "flex", md: "none" },
          bgcolor: "background.paper",
          color: "text.primary",
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar className="flex items-center justify-between" sx={{ px: 2, py: 1, minHeight: "auto !important" }}>
          <IconButton aria-label="Menu" sx={{ color: "text.primary" }}>
            <MenuIcon />
          </IconButton>

          <Logo size="small" />

          <IconButton
            component={Link}
            href="/cart"
            aria-label="Cart"
            sx={{ color: "text.primary" }}
          >
            <Badge
              badgeContent={cartCount}
              color="primary"
              invisible={cartCount === 0}
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <ShoppingBagOutlinedIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile search row */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          px: 2,
          py: 1,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        <TextField
          placeholder="Search phones, accessories..."
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                </InputAdornment>
              ),
              sx: { fontSize: 14, height: 38 },
            },
          }}
        />
      </Box>

      {/* Category bar */}
      <Box
        component="nav"
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          gap: 3.5,
          px: 5,
          py: 1.5,
          borderBottom: "2px solid",
          borderColor: "divider",
        }}
      >
        {categories.map((cat) => (
          <Typography
            key={cat.name}
            component={Link}
            href={cat.href}
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "text.primary",
              textDecoration: "none",
              "&:hover": { color: "primary.main" },
              transition: "color 0.2s",
            }}
          >
            {cat.name}
          </Typography>
        ))}
        <Typography
          component={Link}
          href="/categories/deals"
          sx={{
            ml: "auto",
            fontSize: 14,
            fontWeight: 600,
            color: "primary.dark",
            textDecoration: "none",
            "&:hover": { color: "primary.main" },
            transition: "color 0.2s",
          }}
        >
          Deals
        </Typography>
      </Box>
    </Box>
  );
}

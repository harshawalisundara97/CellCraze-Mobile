"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MoveToInboxIcon from "@mui/icons-material/MoveToInbox";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import PeopleIcon from "@mui/icons-material/People";
import { Logo } from "./logo";

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  heading: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: <DashboardIcon fontSize="small" /> },
    ],
  },
  {
    heading: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: <InventoryIcon fontSize="small" /> },
      { label: "Categories", href: "/admin/categories", icon: <CategoryIcon fontSize="small" /> },
    ],
  },
  {
    heading: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: <ShoppingCartIcon fontSize="small" /> },
      { label: "Invoices", href: "/admin/invoices", icon: <ReceiptIcon fontSize="small" /> },
    ],
  },
  {
    heading: "Supply",
    items: [
      { label: "Inventory", href: "/admin/inventory", icon: <WarehouseIcon fontSize="small" /> },
      { label: "Suppliers", href: "/admin/suppliers", icon: <PeopleIcon fontSize="small" /> },
      { label: "Purchase orders", href: "/admin/purchase-orders", icon: <LocalShippingIcon fontSize="small" /> },
      { label: "Goods received", href: "/admin/grn", icon: <MoveToInboxIcon fontSize="small" /> },
    ],
  },
  {
    heading: "Insights",
    items: [
      { label: "Reports", href: "/admin/reports", icon: <AssessmentIcon fontSize="small" /> },
    ],
  },
  {
    heading: "Store",
    items: [
      { label: "Settings", href: "/admin/settings", icon: <SettingsIcon fontSize="small" /> },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "#1c1917",
          color: "#ffffff",
          borderRight: "none",
        },
      }}
    >
      <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
        <Logo size="small" dark />
        <Typography
          variant="subtitle2"
          sx={{ mt: 0.5, color: "rgba(255,255,255,0.5)" }}
        >
          Back office
        </Typography>
      </Box>

      {navGroups.map((group, groupIdx) => (
        <Box key={group.heading}>
          {groupIdx > 0 && (
            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", my: 1 }} />
          )}
          <Typography
            variant="subtitle2"
            sx={{ px: 2.5, pt: 1.5, pb: 0.5, color: "rgba(255,255,255,0.5)" }}
          >
            {group.heading}
          </Typography>
          <List disablePadding>
            {group.items.map((item) => {
              const active = isActive(item.href);
              return (
                <ListItemButton
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={active}
                  sx={{
                    py: 0.75,
                    px: 2.5,
                    color: active ? "#ffffff" : "rgba(255,255,255,0.7)",
                    "&.Mui-selected": {
                      bgcolor: "rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      "&:hover": {
                        bgcolor: "rgba(255,255,255,0.12)",
                      },
                    },
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.06)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: active ? "#ec3013" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 800 : 400,
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      ))}
    </Drawer>
  );
}

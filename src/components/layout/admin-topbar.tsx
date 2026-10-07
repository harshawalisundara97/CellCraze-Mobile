"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Box,
} from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

interface AdminTopbarProps {
  children?: React.ReactNode;
}

export function AdminTopbar({ children }: AdminTopbarProps) {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: "2px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ px: { xs: 2, md: 4 }, py: 1.5, minHeight: "auto !important" }}>
        <Box sx={{ flex: 1 }}>{children}</Box>

        <Box className="flex items-center gap-3">
          <IconButton size="small" sx={{ color: "text.secondary" }}>
            <Badge
              badgeContent={3}
              color="primary"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: 10,
                  minWidth: 16,
                  height: 16,
                },
              }}
            >
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>

          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            AD
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ec3013",
      light: "#f45b3c",
      dark: "#c4260f",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#1c1917",
      light: "#44403c",
      dark: "#0c0a09",
      contrastText: "#ffffff",
    },
    background: {
      default: "#fafaf9",
      paper: "#ffffff",
    },
    text: {
      primary: "#1c1917",
      secondary: "#78716c",
    },
    error: {
      main: "#dc2626",
    },
    warning: {
      main: "#d97706",
    },
    success: {
      main: "#16a34a",
    },
    divider: "#e7e5e4",
  },
  typography: {
    fontFamily: "var(--font-archivo), Archivo, system-ui, sans-serif",
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 800,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 800,
    },
    h4: {
      fontWeight: 800,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
      fontSize: "0.875rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.06em",
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: "0.6875rem",
      textTransform: "uppercase" as const,
      letterSpacing: "0.08em",
    },
    button: {
      fontWeight: 600,
      textTransform: "uppercase" as const,
      letterSpacing: "0.04em",
    },
    body2: {
      color: "#78716c",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          border: "2px solid #e7e5e4",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 600,
          fontSize: "0.6875rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.04em",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          fontSize: "0.6875rem",
          textTransform: "uppercase" as const,
          letterSpacing: "0.08em",
          color: "#78716c",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "0.04em",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});

export default theme;

/** @type {import( 'tailwindcss').Config}*/

import { transform } from "typescript";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // ===== BASE NEUTRAL PALETTE (Sage Foundation) =====
        // Light grays with sage undertones for backgrounds and surfaces
        sage: {
          50: "#FAFAF8",  // Primary background - very light sage
          100: "#F5F5F2", // Secondary background
          200: "#FCFCFB", // Raised surface
          300: "#F0F0ED", // Sunken surface
          400: "#E8EDEB", // Border subtle
          500: "#DDE4E2", // Border medium
          600: "#C7D0CC", // Border strong
          700: "#A8B5B0", // Text tertiary
          800: "#6B7D74", // Text secondary
          900: "#4A5C54", // Text primary
        },

        // ===== TEXT COLOR SYSTEM =====
        carbon: {
          50: "#F9FAFB",  // Disabled background
          100: "#F3F4F6", // Disabled surface
          200: "#E5E7EB", // Border subtle
          300: "#D1D5DB", // Border default
          400: "#9CA3AF", // Text tertiary
          500: "#6B7280", // Text secondary
          600: "#4B5563", // Text primary (dark)
          700: "#374151", // Text strong
          800: "#1F2937", // Text emphasis
          900: "#111827", // Text heavy
        },

        // ===== PRIMARY ACCENT SYSTEM (Sage Green Evolution) =====
        primary: {
          50: "#F1F7F4",  // Very light
          100: "#E3EFE9", // Light
          200: "#C7DFD3", // Light medium
          300: "#A8C5B4", // Main primary ⭐
          400: "#8FB09D", // Medium
          500: "#769B86", // Medium dark
          600: "#5D8770", // Dark
          700: "#4A6E5A", // Darker
          800: "#3B5646", // Very dark
          900: "#2E4036", // Darkest
        },

        // ===== SECONDARY ACCENTS =====
        // Blue accents for secondary actions
        blue: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
          800: "#1E40AF",
          900: "#1E3A8A",
        },

        // ===== SEMANTIC COLOR SYSTEM =====
        success: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#22C55E", // Main success
          600: "#16A34A",
          700: "#15803D",
          800: "#166534",
          900: "#14532D",
        },

        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Main warning
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },

        error: {
          50: "#FEF2F2",
          100: "#FEE2E2",
          200: "#FECACA",
          300: "#FCA5A5",
          400: "#F87171",
          500: "#EF4444", // Main error
          600: "#DC2626",
          700: "#B91C1C",
          800: "#991B1B",
          900: "#7F1D1D",
        },

        info: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9", // Main info
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },

        // ===== LEGACY SUPPORT (Backward Compatibility) =====
        // Keep existing sage-green for current components
        "sage-green": {
          50: "#F1F7F4",
          100: "#E3EFE9",
          200: "#C7DFD3",
          300: "#A8C5B4",
          400: "#8FB09D",
          500: "#769B86",
          600: "#5D8770",
          700: "#4A6E5A",
          800: "#3B5646",
          900: "#2E4036",
        },

        // ===== BORDER SYSTEM =====
        border: {
          subtle: "#F3F4F6",
          default: "#E5E7EB",
          medium: "#D1D5DB",
          strong: "#9CA3AF",
          primary: "#A8C5B4",
          success: "#86EFAC",
          warning: "#FCD34D",
          error: "#FCA5A5",
          info: "#7DD3FC",
        },

        // ===== TEXT SEMANTIC SYSTEM =====
        text: {
          primary: "#111827",
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
          muted: "#9CA3AF",
          disabled: "#D1D5DB",
          inverse: "#FFFFFF",
          success: "#166534",
          warning: "#B45309",
          error: "#B91C1C",
          info: "#075985",
        },

        // ===== BACKGROUND SEMANTIC SYSTEM =====
        bg: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
          muted: "#F9FAFB",
          success: "#F0FDF4",
          warning: "#FFFBEB",
          error: "#FEF2F2",
          info: "#F0F9FF",
        },

        // ===== LEGACY BORDER SUPPORT =====
        "sage-border": {
          subtle: "#E8EDEB",
          medium: "#DDE4E2",
          focus: "#A8C5B4",
        },

        // ===== LEGACY TEXT SUPPORT =====
        "sage-text": {
          primary: "#2D3436",
          secondary: "#636E72",
          tertiary: "#808B8F",
          muted: "#9CA3AF",
        },
      },

      // Typography
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        // Display font
        display: ["Inter", "system-ui", "sans-serif"],
      },

      // Font Size
      fontSize: {
        "display-xl": [
          "8rem",
          { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "display-lg": [
          "6rem",
          { lineHeight: "0.95", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        "display-md": [
          "4.5rem",
          { lineHeight: "1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "display-sm": [
          "3.5rem",
          { lineHeight: "1", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        hero: [
          "5rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
      },

      // Enhanced Spacing System
      spacing: {
        18: "4.5rem",    // 72px
        22: "5.5rem",    // 88px
        26: "6.5rem",    // 104px
        30: "7.5rem",    // 120px
        34: "8.5rem",    // 136px
        // Fine-tuned spacing for UI components
        0.5: "0.125rem", // 2px
        1.5: "0.375rem", // 6px
        2.5: "0.625rem", // 10px
        3.5: "0.875rem", // 14px
        4.5: "1.125rem", // 18px
        5.5: "1.375rem", // 22px
        6.5: "1.625rem", // 26px
        7.5: "1.875rem", // 30px
        8.5: "2.125rem", // 34px
        9.5: "2.375rem", // 38px
        10.5: "2.625rem", // 42px
        11.5: "2.875rem", // 46px
        12.5: "3.125rem", // 50px
        13.5: "3.375rem", // 54px
        14.5: "3.625rem", // 58px
        15.5: "3.875rem", // 62px
        16.5: "4.125rem", // 66px
        17.5: "4.375rem", // 70px
        18.5: "4.625rem", // 74px
        19.5: "4.875rem", // 78px
        20.5: "5.125rem", // 82px
        21.5: "5.375rem", // 86px
        22.5: "5.625rem", // 90px
        23.5: "5.875rem", // 94px
        24.5: "6.125rem", // 98px
        25.5: "6.375rem", // 102px
        26.5: "6.625rem", // 106px
        27.5: "6.875rem", // 110px
        28.5: "7.125rem", // 114px
        29.5: "7.375rem", // 118px
        30.5: "7.625rem", // 122px
        31.5: "7.875rem", // 126px
        32.5: "8.125rem", // 130px
        33.5: "8.375rem", // 134px
        34.5: "8.625rem", // 138px
        35.5: "8.875rem", // 142px
      },

      // Enhanced Border Radius System
      borderRadius: {
        xs: "0.125rem",   // 2px
        sm: "0.25rem",    // 4px
        md: "0.375rem",   // 6px
        lg: "0.5rem",     // 8px
        xl: "0.75rem",    // 12px
        "2xl": "1rem",     // 16px
        "3xl": "1.5rem",   // 24px
        "4xl": "2rem",     // 32px
        "5xl": "2.5rem",   // 40px
        "6xl": "3rem",     // 48px
        "7xl": "3.5rem",   // 56px
        "8xl": "4rem",     // 64px
        "9xl": "4.5rem",   // 72px
        "10xl": "5rem",    // 80px
        "11xl": "5.5rem",  // 88px
        "12xl": "6rem",    // 96px
      },

      // Enhanced Backdrop Blur System
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },

      // Enhanced Animation System
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "fade-out": "fadeOut 0.4s ease-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-down": "slideDown 0.6s ease-out",
        "slide-left": "slideLeft 0.5s ease-out",
        "slide-right": "slideRight 0.5s ease-out",
        "scale-in": "scaleIn 0.5s ease-out",
        "scale-out": "scaleOut 0.3s ease-out",
        "bounce-in": "bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "pulse-subtle": "pulseSubtle 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite",
        "shimmer": "shimmer 2s ease-in-out infinite",
        "wiggle": "wiggle 0.5s ease-in-out",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "spin-slow": "spinSlow 3s linear infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleOut: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0.95)", opacity: "0" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
          "70%": { transform: "scale(0.9)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
        float: {
          "0%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(168, 197, 180, 0.3)" },
          "50%": { boxShadow: "0 0 30px rgba(168, 197, 180, 0.5)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        heartbeat: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
    },
  },

  plugins: [],
};

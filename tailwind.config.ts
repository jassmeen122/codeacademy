
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Couleurs professionnelles pour l'informatique
        tech: {
          blue: "hsl(216, 87%, 55%)",
          dark: "hsl(220, 26%, 14%)",
          light: "hsl(220, 26%, 96%)",
          gray: "hsl(220, 13%, 65%)",
        },
        robot: {
          primary: "hsl(199, 89%, 48%)",
          secondary: "hsl(204, 64%, 44%)",
          accent: "hsl(142, 69%, 58%)",
        },
        education: {
          primary: "hsl(231, 48%, 48%)",
          secondary: "hsl(262, 83%, 58%)",
          success: "hsl(142, 71%, 45%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        // Animations robotiques subtiles
        "robot-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 hsl(199, 89%, 48% / 0.4)"
          },
          "50%": {
            boxShadow: "0 0 0 8px hsl(199, 89%, 48% / 0)"
          }
        },
        "tech-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(216, 87%, 55% / 0.1)"
          },
          "50%": {
            boxShadow: "0 0 30px hsl(216, 87%, 55% / 0.2)"
          }
        },
        "data-flow": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0"
          },
          "50%": {
            opacity: "1"
          },
          "100%": {
            transform: "translateX(100%)",
            opacity: "0"
          }
        },
        "circuit-pulse": {
          "0%, 100%": {
            opacity: "0.3"
          },
          "50%": {
            opacity: "0.8"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        "robot-pulse": "robot-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "tech-glow": "tech-glow 3s ease-in-out infinite",
        "data-flow": "data-flow 4s ease-in-out infinite",
        "circuit-pulse": "circuit-pulse 2s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'tech-grid': 'linear-gradient(rgba(54, 57, 64, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(54, 57, 64, 0.4) 1px, transparent 1px)',
        'circuit-pattern': 'radial-gradient(circle at 25% 25%, hsl(199, 89%, 48% / 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(216, 87%, 55% / 0.05) 0%, transparent 50%)',
      },
      boxShadow: {
        'tech': '0 4px 20px hsl(216, 87%, 55% / 0.1)',
        'robot': '0 4px 20px hsl(199, 89%, 48% / 0.15)',
        'card-hover': '0 8px 30px hsl(220, 26%, 14% / 0.12)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

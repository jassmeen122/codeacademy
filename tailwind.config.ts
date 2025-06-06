
import type { Config } from "tailwindcss";

export default {
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
          DEFAULT: "hsl(var(--primary))", // Bleu foncé
          foreground: "hsl(var(--primary-foreground))", // Blanc
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Bleu
          foreground: "hsl(var(--secondary-foreground))", // Blanc
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Vert
          foreground: "hsl(var(--accent-foreground))", // Blanc
        },
        success: {
          DEFAULT: "hsl(var(--success))", // Vert
          foreground: "hsl(var(--success-foreground))", // Blanc
        },
        info: {
          DEFAULT: "hsl(var(--info))", // Bleu
          foreground: "hsl(var(--info-foreground))", // Blanc
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))", // Blanc
          foreground: "hsl(var(--card-foreground))", // Bleu foncé
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Roboto', 'system-ui', 'sans-serif'],
        'code': ['Fira Code', 'Courier New', 'monospace'],
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
        "simple-fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "simple-fade-in": "simple-fade-in 0.6s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;


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
        // Couleurs cyber futuristes
        "neon-blue": "rgb(var(--neon-blue))",
        "neon-green": "rgb(var(--neon-green))",
        "neon-purple": "rgb(var(--neon-purple))",
        "neon-cyan": "rgb(var(--neon-cyan))",
        "cyber-silver": "rgb(var(--cyber-silver))",
        "dark-bg": "rgb(var(--dark-bg))",
        "darker-bg": "rgb(var(--darker-bg))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'display': ['Orbitron', 'monospace'],
        'cyber': ['Orbitron', 'monospace'],
        'body': ['Exo 2', 'sans-serif'],
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
        // Animations futuristes
        "cyber-pulse": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)"
          }
        },
        "circuit-glow": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "data-stream": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "hologram": {
          "0%, 100%": { opacity: "1", filter: "hue-rotate(0deg)" },
          "50%": { opacity: "0.8", filter: "hue-rotate(90deg)" }
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" }
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cyber-pulse": "cyber-pulse 2s infinite",
        "circuit-glow": "circuit-glow 3s ease-in-out infinite",
        "data-stream": "data-stream 2s linear infinite",
        "hologram": "hologram 4s ease-in-out infinite",
        "scan-line": "scan-line 2s linear infinite",
        "matrix-rain": "matrix-rain 3s linear infinite",
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(45deg, rgb(59 130 246), rgb(16 185 129))',
        'hologram-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'circuit-pattern': 'radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.2) 2px, transparent 2px), radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.2) 2px, transparent 2px)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

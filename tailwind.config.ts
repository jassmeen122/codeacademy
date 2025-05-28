
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
        // Nouvelles couleurs néon
        neon: {
          blue: "hsl(var(--neon-blue))",
          green: "hsl(var(--neon-green))",
          purple: "hsl(var(--neon-purple))",
          cyan: "hsl(var(--neon-cyan))",
        },
        terminal: {
          green: "hsl(var(--terminal-green))",
        },
        matrix: {
          green: "hsl(var(--matrix-green))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
        // Nouvelles animations futuristes
        "neon-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px hsl(var(--primary))",
            transform: "scale(1)"
          },
          "50%": { 
            boxShadow: "0 0 20px hsl(var(--primary)), 0 0 30px hsl(var(--primary))",
            transform: "scale(1.02)"
          },
        },
        "cyber-glow": {
          "0%, 100%": {
            background: "linear-gradient(45deg, hsl(var(--primary)), hsl(var(--accent)), hsl(var(--primary)))"
          },
          "50%": {
            background: "linear-gradient(45deg, hsl(var(--accent)), hsl(var(--primary)), hsl(var(--accent)))"
          }
        },
        "matrix-rain": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" }
        },
        "data-flow": {
          "0%": { 
            transform: "translateX(-100%) scaleX(0)",
            opacity: "0"
          },
          "50%": {
            transform: "translateX(0%) scaleX(1)",
            opacity: "1"
          },
          "100%": { 
            transform: "translateX(100%) scaleX(0)",
            opacity: "0"
          }
        },
        "hologram": {
          "0%, 100%": { 
            opacity: "0.8",
            filter: "hue-rotate(0deg)"
          },
          "50%": { 
            opacity: "1",
            filter: "hue-rotate(90deg)"
          }
        },
        "terminal-typing": {
          "0%": { width: "0%" },
          "100%": { width: "100%" }
        },
        "circuit-pulse": {
          "0%, 100%": { 
            borderColor: "hsl(var(--primary) / 0.3)",
            boxShadow: "0 0 0 0 hsl(var(--primary) / 0.7)"
          },
          "50%": { 
            borderColor: "hsl(var(--primary))",
            boxShadow: "0 0 0 4px hsl(var(--primary) / 0)"
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        shimmer: "shimmer 8s infinite linear",
        // Nouvelles animations
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "cyber-glow": "cyber-glow 3s linear infinite",
        "matrix-rain": "matrix-rain 3s linear infinite",
        "scan-line": "scan-line 2s linear infinite",
        "data-flow": "data-flow 3s ease-in-out infinite",
        "hologram": "hologram 4s ease-in-out infinite",
        "terminal-typing": "terminal-typing 2s steps(20) infinite",
        "circuit-pulse": "circuit-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'cyber-grid': 'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
        'neon-gradient': 'linear-gradient(45deg, hsl(var(--neon-blue)), hsl(var(--neon-green)), hsl(var(--neon-purple)))',
        'matrix-gradient': 'linear-gradient(180deg, transparent, hsl(var(--matrix-green) / 0.1), transparent)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'neon-sm': '0 0 10px hsl(var(--primary) / 0.5)',
        'neon': '0 0 20px hsl(var(--primary) / 0.6)',
        'neon-lg': '0 0 40px hsl(var(--primary) / 0.8)',
        'cyber': '0 0 0 1px hsl(var(--primary) / 0.5), 0 0 20px hsl(var(--primary) / 0.3)',
      },
      fontFamily: {
        'mono': ['Fira Code', 'Monaco', 'Cascadia Code', 'Ubuntu Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

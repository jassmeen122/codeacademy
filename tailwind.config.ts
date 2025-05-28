
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
        // Couleurs cyber néon éducatives
        neon: {
          blue: "hsl(var(--neon-blue))",
          green: "hsl(var(--neon-green))",
          purple: "hsl(var(--neon-purple))",
          cyan: "hsl(var(--neon-cyan))",
          orange: "hsl(var(--cyber-orange))",
        },
        terminal: {
          green: "hsl(var(--terminal-green))",
        },
        electric: {
          violet: "hsl(var(--electric-violet))",
        },
        // Nouvelles couleurs éducatives
        education: {
          gold: "hsl(var(--education-gold))",
        },
        knowledge: {
          blue: "hsl(var(--knowledge-blue))",
        },
        learning: {
          teal: "hsl(var(--learning-teal))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        mono: ['Fira Code', 'Monaco', 'Cascadia Code', 'Ubuntu Mono', 'Courier New', 'monospace'],
        cyber: ['Orbitron', 'Fira Code', 'Monaco', 'monospace'],
        education: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
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
        // Animations cyber éducatives
        "cyber-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--knowledge-blue) / 0.3)"
          },
          "50%": {
            boxShadow: "0 0 40px hsl(var(--education-gold) / 0.6), 0 0 60px hsl(var(--knowledge-blue) / 0.3)"
          }
        },
        "educational-data-flow": {
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
        "learning-pulse": {
          "0%, 100%": { 
            borderColor: "hsl(var(--education-gold) / 0.3)",
            boxShadow: "0 0 0 0 hsl(var(--education-gold) / 0.7)"
          },
          "50%": { 
            borderColor: "hsl(var(--education-gold))",
            boxShadow: "0 0 0 4px hsl(var(--education-gold) / 0)"
          }
        },
        "knowledge-hologram": {
          "0%, 100%": { 
            opacity: "0.8",
            filter: "hue-rotate(0deg)",
            textShadow: "0 0 10px hsl(var(--knowledge-blue))"
          },
          "50%": { 
            opacity: "1",
            filter: "hue-rotate(90deg)",
            textShadow: "0 0 20px hsl(var(--education-gold))"
          }
        },
        "book-study": {
          "0%": { transform: "rotateY(0deg) scale(1)" },
          "25%": { transform: "rotateY(90deg) scale(1.1)" },
          "50%": { transform: "rotateY(180deg) scale(1)" },
          "75%": { transform: "rotateY(270deg) scale(1.1)" },
          "100%": { transform: "rotateY(360deg) scale(1)" }
        },
        "educational-scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100vw)" }
        },
        "learning-typing": {
          "0%": { width: "0%" },
          "100%": { width: "100%" }
        },
        "education-neon-pulse": {
          "0%, 100%": { 
            textShadow: "0 0 5px hsl(var(--education-gold))",
            transform: "scale(1)"
          },
          "50%": { 
            textShadow: "0 0 20px hsl(var(--education-gold)), 0 0 30px hsl(var(--knowledge-blue))",
            transform: "scale(1.05)"
          },
        },
        "diploma-shine": {
          "0%": { 
            background: "linear-gradient(45deg, transparent, hsl(var(--education-gold) / 0.1), transparent)",
            backgroundPosition: "-100% 0"
          },
          "100%": { 
            background: "linear-gradient(45deg, transparent, hsl(var(--education-gold) / 0.3), transparent)",
            backgroundPosition: "100% 0"
          }
        },
        "bulb-flash": {
          "0%, 100%": { 
            filter: "brightness(1)",
            transform: "scale(1)"
          },
          "50%": { 
            filter: "brightness(1.5) drop-shadow(0 0 10px hsl(var(--education-gold)))",
            transform: "scale(1.1)"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeIn: "fadeIn 0.5s ease-out",
        slideIn: "slideIn 0.3s ease-out",
        shimmer: "shimmer 8s infinite linear",
        // Animations cyber éducatives
        "cyber-glow": "cyber-glow 3s ease-in-out infinite",
        "educational-data-flow": "educational-data-flow 4s ease-in-out infinite",
        "learning-pulse": "learning-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "knowledge-hologram": "knowledge-hologram 5s ease-in-out infinite",
        "book-study": "book-study 6s ease-in-out infinite",
        "educational-scan": "educational-scan 3s linear infinite",
        "learning-typing": "learning-typing 3s steps(25) infinite",
        "education-neon-pulse": "education-neon-pulse 2.5s ease-in-out infinite",
        "diploma-shine": "diploma-shine 3s ease-in-out infinite",
        "bulb-flash": "bulb-flash 2s ease-in-out infinite",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'educational-grid': 'linear-gradient(rgba(255, 193, 7, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 150, 255, 0.1) 1px, transparent 1px)',
        'learning-gradient': 'linear-gradient(45deg, hsl(var(--knowledge-blue)), hsl(var(--education-gold)), hsl(var(--learning-teal)))',
        'study-gradient': 'linear-gradient(180deg, transparent, hsl(var(--education-gold) / 0.1), transparent)',
        'knowledge-circuit': 'radial-gradient(circle at 25% 25%, hsl(var(--knowledge-blue) / 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--education-gold) / 0.1) 0%, transparent 50%)',
        'educational-pattern': 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--education-gold) / 0.05) 10px, hsl(var(--education-gold) / 0.05) 20px)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'cyber-sm': '0 0 10px hsl(var(--knowledge-blue) / 0.3)',
        'cyber': '0 0 20px hsl(var(--knowledge-blue) / 0.4)',
        'cyber-lg': '0 0 40px hsl(var(--education-gold) / 0.6)',
        'education-glow': '0 0 0 1px hsl(var(--education-gold) / 0.5), 0 0 20px hsl(var(--education-gold) / 0.3)',
        'knowledge-glow': '0 0 20px hsl(var(--knowledge-blue) / 0.4)',
        'learning-shadow': '0 4px 20px hsl(var(--learning-teal) / 0.3)',
        'study-focus': '0 0 30px hsl(var(--education-gold) / 0.5), inset 0 0 20px hsl(var(--knowledge-blue) / 0.1)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

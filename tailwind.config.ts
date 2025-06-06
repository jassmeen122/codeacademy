
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
          DEFAULT: "hsl(var(--primary))", // Bleu électrique
          foreground: "hsl(var(--primary-foreground))", // Noir foncé
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // Gris foncé
          foreground: "hsl(var(--secondary-foreground))", // Blanc cassé
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // Vert néon
          foreground: "hsl(var(--accent-foreground))", // Noir foncé
        },
        success: {
          DEFAULT: "hsl(var(--success))", // Vert néon
          foreground: "hsl(var(--success-foreground))", // Noir foncé
        },
        info: {
          DEFAULT: "hsl(var(--info))", // Cyan tech
          foreground: "hsl(var(--info-foreground))", // Noir foncé
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
          DEFAULT: "hsl(var(--card))", // Carte sombre
          foreground: "hsl(var(--card-foreground))", // Blanc cassé
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        'neon-blue': '#0ea5e9',
        'neon-green': '#22c55e',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'code': ['JetBrains Mono', 'Fira Code', 'monospace'],
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
        "matrix-fade": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px) scale(0.95)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)"
          }
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 20px hsla(var(--primary), 0.3)"
          },
          "50%": {
            boxShadow: "0 0 30px hsla(var(--primary), 0.6)"
          }
        },
        "tech-slide": {
          "0%": {
            transform: "translateX(-100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateX(0)",
            opacity: "1"
          }
        },
        "matrix-rain": {
          "0%": {
            transform: "translateY(-100%)",
            opacity: "0"
          },
          "10%": {
            opacity: "1"
          },
          "90%": {
            opacity: "1"
          },
          "100%": {
            transform: "translateY(100vh)",
            opacity: "0"
          }
        },
        "scan-line": {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(100%)"
          }
        },
        "hologram": {
          "0%, 100%": {
            transform: "rotateY(0deg) scale(1)",
            filter: "hue-rotate(0deg)"
          },
          "25%": {
            transform: "rotateY(5deg) scale(1.02)",
            filter: "hue-rotate(90deg)"
          },
          "50%": {
            transform: "rotateY(0deg) scale(1.05)",
            filter: "hue-rotate(180deg)"
          },
          "75%": {
            transform: "rotateY(-5deg) scale(1.02)",
            filter: "hue-rotate(270deg)"
          }
        },
        "data-flow": {
          "0%": {
            transform: "translateX(-100%) rotate(0deg)",
            opacity: "0"
          },
          "50%": {
            opacity: "1"
          },
          "100%": {
            transform: "translateX(100%) rotate(360deg)",
            opacity: "0"
          }
        },
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px hsla(var(--primary), 0.3)"
          },
          "50%": {
            boxShadow: "0 0 20px hsla(var(--primary), 0.8), 0 0 30px hsla(var(--accent), 0.4)"
          }
        },
        "terminal-typing": {
          "0%": { width: "0" },
          "100%": { width: "100%" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "matrix-fade": "matrix-fade 0.6s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "tech-slide": "tech-slide 0.5s ease-out",
        "matrix-rain": "matrix-rain 3s linear infinite",
        "scan-line": "scan-line 3s linear infinite",
        "hologram": "hologram 2s ease-in-out infinite",
        "data-flow": "data-flow 4s linear infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "terminal-typing": "terminal-typing 1s steps(40, end)",
      },
      boxShadow: {
        'tech': '0 0 20px hsla(var(--primary), 0.3)',
        'tech-lg': '0 0 30px hsla(var(--primary), 0.5)',
        'accent': '0 0 20px hsla(var(--accent), 0.3)',
        'dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
        'dark-lg': '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
      },
      animationDelay: {
        '1000': '1s',
        '2000': '2s',
        '3000': '3s',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

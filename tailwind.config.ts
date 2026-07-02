import type { Config } from "tailwindcss";

export default {
	content: ["./index.html", "./src/**/*.{ts,tsx}"],
	theme: {
		extend: {
			// The mapper (toModernEngineerData) emits "from-primary-500
			// to-primary-700" for the email contact chip. "primary" isn't
			// a default Tailwind color, so it's aliased to the template's
			// existing violet accent to keep the two halves in sync.
			colors: {
				primary: {
					50: "#f5f3ff",
					100: "#ede9fe",
					200: "#ddd6fe",
					300: "#c4b5fd",
					400: "#a78bfa",
					500: "#8b5cf6",
					600: "#7c3aed",
					700: "#6d28d9",
					800: "#5b21b6",
					900: "#4c1d95",
				},
			},
			keyframes: {
				float: {
					"0%, 100%": { transform: "translateY(0px)" },
					"50%": { transform: "translateY(-14px)" },
				},
				"fade-in-up": {
					"0%": { opacity: "0", transform: "translateY(24px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"pulse-glow": {
					"0%, 100%": { opacity: "0.6", transform: "scale(1)" },
					"50%": { opacity: "1", transform: "scale(1.04)" },
				},
			},
			animation: {
				float: "float 6s ease-in-out infinite",
				"fade-in-up": "fade-in-up 0.9s ease-out both",
				"pulse-glow": "pulse-glow 3s ease-in-out infinite",
			},
		},
	},
	plugins: [],
} satisfies Config;

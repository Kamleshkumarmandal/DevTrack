import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211f",
        muted: "#7b8581",
        canvas: "#f5f7f5",
        forest: "#246b54",
        mint: "#e5f3ec"
      },
      boxShadow: { soft: "0 12px 36px rgba(24, 43, 35, 0.06)" }
    }
  },
  plugins: []
};
export default config;
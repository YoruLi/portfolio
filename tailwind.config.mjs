/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundImage: "var(--accent-gradient)",
      colors: {
        background: "hsl(var(--background))",
      },
    },
  },
  plugins: [],
};
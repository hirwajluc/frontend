/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#054a29",
          DEFAULT: "#054a29",
          dark: "#054a29",
        },
        secondary: {
          light: "#E9EDEB",
          DEFAULT: "#E9EDEB",
          dark: "#E9EDEB",
        },
        success: {
          light: "#28a745",
          DEFAULT: "#218838",
          dark: "#1e7e34",
        },
        error: {
          light: "#dc3545",
          DEFAULT: "#c82333",
          dark: "#bd2130",
        },
        sidebar: {
          light: "#F9F9F9",
          DEFAULT: "#F9F9F9",
          dark: "#F9F9F9",
        },
        card: {
          light: "#F8FAFB",
          DEFAULT: "#F8FAFB",
          dark: "#F8FAFB",
        },
        border: {
          light: "#F3F4F6",
          DEFAULT: "#F3F4F6",
          dark: "#F3F4F6",
        },

        // Add more custom colors as needed
      },
    },
  },
  variants: {},
  plugins: [],
};

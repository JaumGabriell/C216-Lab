import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.js"],
    include: [
      "src/tests/unit/**/*.test.{js,jsx}",
      "src/tests/integration/**/*.test.{js,jsx}",
    ],
  },
});

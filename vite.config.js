import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Vite config: React plugin + Tailwind CSS plugin
export default defineConfig({
  plugins: [react(), tailwindcss()],
});

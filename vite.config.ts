import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // allow imports like: import X from 'src/components/X'
      src: path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
  },
});

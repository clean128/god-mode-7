import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Match exact package import `mapbox-gl` only, leaving deeper imports like
      // `mapbox-gl/dist/mapbox-gl.css` untouched so they resolve normally.
      { find: /^mapbox-gl$/, replacement: "mapbox-gl/dist/mapbox-gl.js" },
    ],
  },
  define: {
    // Some libs expect process.env to exist
    "process.env": {},
  },
  optimizeDeps: {
    include: ["mapbox-gl"],
  },
});

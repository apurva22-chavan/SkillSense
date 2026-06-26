import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // Output into /frontend/dist so Django's STATICFILES_DIRS can find it
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        // Deterministic filenames so the Django template can reference them
        entryFileNames: "assets/index.js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name].[ext]",
      },
    },
  },

  // Dev-server proxy: forward /api/* to Django running on :8000
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: true,
    proxy: {
      "/api/wandbox": {
        target: "https://wandbox.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wandbox/, "/api"),
      },
      "/api/piston": {
        target: "https://emkc.org",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/piston/, "/api/v2/piston"),
      },
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: false,
    css: true,
    env: {
      VITE_SUPABASE_URL: "",
      VITE_SUPABASE_ANON_KEY: "",
      VITE_APP_ENV: "test",
    },
  },
});

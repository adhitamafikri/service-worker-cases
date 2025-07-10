import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "public",
    emptyOutDir: false,
    lib: {
      entry: "./src/sw/sw.ts",
      formats: ["es"],
      fileName: "sw",
      name: "ServiceWorker",
    },
    rollupOptions: {
      external: [],
      output: {
        format: "es",
        entryFileNames: "sw.js",
      },
    },
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
});

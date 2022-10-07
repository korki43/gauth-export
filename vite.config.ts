import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteMinifyPlugin } from "vite-plugin-minify";

export default defineConfig({
  plugins: [viteSingleFile(), ViteMinifyPlugin()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
});

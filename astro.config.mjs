import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

/** Pages that are noindex and must never appear in the sitemap. */
const NOINDEX_PATHS = ["/404/", "/thank-you/"];

export default defineConfig({
  site: "https://www.vallisglobal.in",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory" },
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !NOINDEX_PATHS.some((path) => new URL(page).pathname === path),
      lastmod: new Date(),
    }),
  ],
});

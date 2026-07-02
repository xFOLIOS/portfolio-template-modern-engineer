import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// CRITICAL: base must be relative ("./") because GitHub Project Pages
// serve from https://<user>.github.io/<repoName>/ , not the domain root.
// An absolute base ("/") causes all JS/CSS to 404 → blank unstyled page.
export default defineConfig({
	base: "./",
	plugins: [react()],
});

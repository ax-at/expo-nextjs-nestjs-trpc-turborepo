import { defineConfig } from "tsup";

// const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  entry: ["src/index.ts"],
  skipNodeModulesBundle: true,
  format: ["cjs"],
  minify: false,
  noExternal: [/./],
});

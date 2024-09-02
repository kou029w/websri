import { defineConfig } from "tsup";

export default defineConfig(() => {
  return {
    clean: true,
    dts: true,
    entry: ["src"],
    format: ["cjs", "esm"],
  };
});

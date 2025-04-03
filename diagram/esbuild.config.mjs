import { build } from "esbuild";
import copyStaticFiles from "esbuild-copy-static-files";

build({
  entryPoints: ["src/index.ts"], // Change to your main entry
  outdir: "dist",
  bundle: true,
  format: "esm", // Use "cjs" if you need CommonJS
  sourcemap: true,
  target: "esnext",
  logLevel: "info",
  plugins: [
    copyStaticFiles({
      src: "assets", // Source directory
      dest: "dist/assets", // Destination directory in dist
      dereference: true,
      recursive: true,
    }),
  ],
}).catch(() => process.exit(1));
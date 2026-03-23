import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Statisk export för Tauri — ingen server behövs
  output: "export",
  // Bilder hanteras utan Next.js Image Optimization (fungerar i statisk export)
  images: { unoptimized: true },
  // Tauri hanterar routing med filbaserad navigering
  trailingSlash: true,
};

export default nextConfig;

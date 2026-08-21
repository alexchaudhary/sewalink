import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // CRITICAL SENIOR FIX: Explicitly lock the file tracing layer down to the frontend directory bounds
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

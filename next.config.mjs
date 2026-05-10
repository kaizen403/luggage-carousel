const usePagesBasePath = process.env.PAGES_BASE_PATH === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: usePagesBasePath ? "/luggage-carousel" : "",
  turbopack: {
    root: process.cwd()
  },
  trailingSlash: true
};

export default nextConfig;

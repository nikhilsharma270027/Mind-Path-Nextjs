import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
  webpack(config: Configuration): Configuration {
    config.resolve = {
      ...(config.resolve || {}),
      alias: {
        ...(config.resolve?.alias || {}),
        canvas: false,
      },
    };
    return config;
  },
  // experimental: {
  //   appDir: true, // Explicitly enables App Router
  // },
};

export default nextConfig;

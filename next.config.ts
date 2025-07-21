/** @type {import('next').NextConfig} */
const nextConfig: any = {
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  output: "standalone",
  images: {
    domains: ["avatars.githubusercontent.com", "lh3.googleusercontent.com"],
  },
};

export default nextConfig;

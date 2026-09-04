/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Deadline build: don't let a stray lint warning block the Vercel deploy.
  eslint: { ignoreDuringBuilds: true },
  // A stray package-lock.json exists in the user's home dir; pin the trace root.
  outputFileTracingRoot: import.meta.dirname,
  // react-force-graph pulls optional deps it does not need in a browser bundle.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "react-native-fs": false,
      "react-native-fetch-blob": false,
    };
    return config;
  },
};

export default nextConfig;

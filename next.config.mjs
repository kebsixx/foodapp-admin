/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ftcctrtnvcytcuuljjik.supabase.co",
      },
    ],
  },
};

export default nextConfig;

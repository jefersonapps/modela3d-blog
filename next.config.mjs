/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  swcMinify: false,
  redirects: async () => [
    {
      source: "/",
      destination: "https://modela3d.vercel.app/blog",
      permanent: true,
    },
  ],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
	protocol: "https",
	hostname: "jg85j4iw4v.ufs.sh",
       },
    ],
  },
};

export default nextConfig;

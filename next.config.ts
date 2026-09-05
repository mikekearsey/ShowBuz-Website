import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/auth/email-confirmed",
        destination: "/email-confirmed",
        permanent: false,
      },
      {
        source: "/auth/reset-password",
        destination: "/reset-password",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

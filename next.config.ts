import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "media.opticsjordan.com" },
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
};

export default withNextIntl(nextConfig);

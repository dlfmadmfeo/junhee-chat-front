import createBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  // output: "export",
  distDir: 'dist',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

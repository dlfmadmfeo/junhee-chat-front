import createBundleAnalyzer from '@next/bundle-analyzer';

/** @type {import('next').NextConfig} */
const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    // output: "export",
    distDir: "dist",
};

export default withBundleAnalyzer(nextConfig);

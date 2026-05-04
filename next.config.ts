declare module 'next-pwa';

import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // fixes turbopack error
};

export default withPWA(nextConfig);
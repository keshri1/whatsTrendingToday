const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "*.ytimg.com" },
      { protocol: "https", hostname: "preview.redd.it" },
      { protocol: "https", hostname: "*.redd.it" },
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "*.p16-sign.tiktokcdn.com" },
      { protocol: "https", hostname: "*.tiktokcdn.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;

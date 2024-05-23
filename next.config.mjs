/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apod.nasa.gov",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.youtube.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.vimeo.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "player.vimeo.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "solarsystem.nasa.gov",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;

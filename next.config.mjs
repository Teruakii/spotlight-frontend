/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Place images are now arbitrary URLs the user pastes into
    // ImageUrlListInput (see PlaceForm) rather than a fixed Unsplash-only
    // set, so allow any https host. TODO: tighten this to a real allowlist
    // once there's an actual image upload/hosting story.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

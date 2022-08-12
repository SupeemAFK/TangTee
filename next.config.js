/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/(.*)?',
        headers: [{
          key: 'X-Frame-Options',
          value: 'ALLOW-FROM',
        }],
      },
    ]
  },
}

module.exports = nextConfig

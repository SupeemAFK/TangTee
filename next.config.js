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
          value: 'ALLOW-FROM http://localhost:3000/',
        }, 
        { 
          key: "Access-Control-Allow-Origin", 
          value: "http://localhost:3000" 
        }],
      },
    ]
  },
}

module.exports = nextConfig

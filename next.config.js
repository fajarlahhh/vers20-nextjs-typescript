/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [
      {
        source: '/success',
        destination: '/success',
        permanent: true,
      }
    ]
  },
}

module.exports = nextConfig

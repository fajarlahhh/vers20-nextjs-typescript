/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

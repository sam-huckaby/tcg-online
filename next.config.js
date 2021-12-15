module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/mtg',
        destination: '/utils/mtg-counter',
      },
    ]
  },
}

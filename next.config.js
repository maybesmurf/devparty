const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')

module.exports = withPWA({
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching
  },
  swcMinify: true,
  reactStrictMode: true,
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    OPENSEA_API_KEY: process.env.OPENSEA_API_KEY,
    BASE_URL: process.env.BASE_URL,
    NFT_RPC_URL: process.env.NFT_RPC_URL,
    GIT_COMMIT_REF: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
    GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    NFT_MARKET_ADDRESS: process.env.NFT_MARKET_ADDRESS,
    NFT_ADDRESS: process.env.NFT_ADDRESS
  }
})

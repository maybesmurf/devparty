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
    BASE_URL: process.env.BASE_URL,
    GIT_COMMIT_REF: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF,
    GIT_COMMIT_SHA: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
    MAINET_CONTRACT_ADDRESS: process.env.MAINET_CONTRACT_ADDRESS,
    RINKEBY_CONTRACT_ADDRESS: process.env.RINKEBY_CONTRACT_ADDRESS,
    MATIC_CONTRACT_ADDRESS: process.env.MATIC_CONTRACT_ADDRESS,
    MUMBAI_CONTRACT_ADDRESS: process.env.MUMBAI_CONTRACT_ADDRESS,
    DEV_CONTRACT_ADDRESS: process.env.DEV_CONTRACT_ADDRESS,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    IS_MAINNET: process.env.IS_MAINNET
  }
})

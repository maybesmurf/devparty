import React from 'react'

// Environments
export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'

// Versions
export const REACT_VERSION = React.version

// Git
export const GIT_COMMIT_SHA = process.env.GIT_COMMIT_SHA?.slice(0, 7)
export const GIT_COMMIT_REF = process.env.GIT_COMMIT_REF

// Configs
export const POLLING_INTERVAL = 1000 * 60 // 1 minute

// Messages
export const ERROR_MESSAGE = 'Something went wrong!'
export const RESERVED_SLUGS = ['admin', 'discover', 'products', 'new']
export const PUBLIC_SIGNING_MESSAGE =
  'Welcome to Devparty 👋\n\nDevparty uses this cryptographic signature in place of a password, verifying that you are the owner of this Ethereum address.\n\nNonce:'

// URLs
export const BASE_URL = process.env.BASE_URL
export const GRAPHCDN_URL = 'https://graphql.devparty.io'
export const STATIC_ASSETS = 'https://assets.devparty.io/images'
export const OPENSEA_API_URL = `https://${
  IS_PRODUCTION ? 'testnets-api' : 'testnets-api'
}.opensea.io/api/v1`

// NFT
export const MAINET_CONTRACT_ADDRESS = process.env.MAINET_CONTRACT_ADDRESS
export const RINKEBY_CONTRACT_ADDRESS = process.env.RINKEBY_CONTRACT_ADDRESS
export const MATIC_CONTRACT_ADDRESS = process.env.MATIC_CONTRACT_ADDRESS
export const MUMBAI_CONTRACT_ADDRESS = process.env.MUMBAI_CONTRACT_ADDRESS
export const INFURA_ID = '3d19324a72854976a7160e0e2ebc9c2b'
export const FORTMATIC_KEY = IS_PRODUCTION
  ? 'pk_test_7E1A4EA61903B76F'
  : 'pk_live_66C75459C14ADB4A'

// Misc
export const GRAPHCDN_ENABLED =
  IS_PRODUCTION && process.env.VERCEL_ENV !== 'preview'

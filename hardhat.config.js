require('@nomiclabs/hardhat-waffle')

const privateKey = process.env.METAMASK_PRIVATE_KEY || 'ab0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    // Local Chain
    hardhat: { chainId: 1337 },

    // Ethereum Chains
    mainnet: {
      url: 'https://eth-mainnet.alchemyapi.io/v2/YrakKL9PgzgkHkmGh6Pb6lLQyEITVk4n',
      accounts: [privateKey]
    },
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/M2Al2afJT67g7lHHgJ9q159VFLt_JVNQ',
      accounts: [privateKey]
    },

    // Polygon Chains
    matic: {
      url: 'https://polygon-mainnet.g.alchemy.com/v2/B5oillnkGtn6oiDPI3pOeYpxTvPjzn9C',
      accounts: [privateKey]
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/l2CAYeON7QrCZGPU8wbGPoeT0GOxwbJ_',
      accounts: [privateKey]
    }
  },
  solidity: {
    version: '0.8.10',
    settings: { optimizer: { enabled: true, runs: 200 } }
  }
}

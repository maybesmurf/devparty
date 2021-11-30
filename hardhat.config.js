require('@nomiclabs/hardhat-waffle')

const privateKey = process.env.METAMASK_PRIVATE_KEY || '01234567890123456789'

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    // Local Chain
    hardhat: { chainId: 1337 },

    // Ethereum Chains
    mainnet: {
      url: 'https://speedy-nodes-nyc.moralis.io/ff1274045f2cabf446cb8753/eth/mainnet',
      accounts: [privateKey]
    },
    rinkeby: {
      url: 'https://speedy-nodes-nyc.moralis.io/ff1274045f2cabf446cb8753/eth/rinkeby',
      accounts: [privateKey]
    },

    // Polygon Chains
    matic: {
      url: 'https://speedy-nodes-nyc.moralis.io/ff1274045f2cabf446cb8753/polygon/mainnet',
      accounts: [privateKey]
    },
    mumbai: {
      url: 'https://speedy-nodes-nyc.moralis.io/ff1274045f2cabf446cb8753/polygon/mumbai',
      accounts: [privateKey]
    }
  },
  solidity: {
    version: '0.8.10',
    settings: { optimizer: { enabled: true, runs: 200 } }
  }
}

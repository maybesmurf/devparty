require('@nomiclabs/hardhat-waffle')

const privateKey = process.env.METAMASK_PRIVATE_KEY || '01234567890123456789'

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    // Local Chain
    hardhat: { chainId: 1337 },

    // Ethereum Chains
    ethMainnet: {
      url: 'https://mainnet.infura.io/v3/3d19324a72854976a7160e0e2ebc9c2b',
      accounts: [privateKey]
    },
    ethTestnet: {
      url: 'https://rinkeby.infura.io/v3/3d19324a72854976a7160e0e2ebc9c2b',
      accounts: [privateKey]
    },

    // Polygon Chains
    polygonMainnet: {
      url: 'https://polygon-mumbai.infura.io/v3/3d19324a72854976a7160e0e2ebc9c2b',
      accounts: [privateKey]
    },
    polygonTestnet: {
      url: 'https://rpc-matic.maticvigil.com',
      accounts: [privateKey]
    }
  },
  solidity: {
    version: '0.8.10',
    settings: { optimizer: { enabled: true, runs: 200 } }
  }
}

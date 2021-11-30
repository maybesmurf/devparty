require('@nomiclabs/hardhat-waffle')

const privateKey = process.env.METAMASK_PRIVATE_KEY || '01234567890123456789'

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    // Local Chain
    hardhat: { chainId: 1337 },

    // Ethereum Chains
    mainet: {
      url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },
    goerli: {
      url: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },
    kovan: {
      url: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },

    // Polygon Chains
    mumbai: {
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [privateKey]
    },
    matic: {
      url: 'https://rpc-matic.maticvigil.com',
      accounts: [privateKey]
    }
  },
  solidity: {
    version: '0.8.10',
    settings: { optimizer: { enabled: true, runs: 200 } }
  }
}

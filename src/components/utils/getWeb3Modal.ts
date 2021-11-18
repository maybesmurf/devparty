import WalletConnectProvider from '@walletconnect/web3-provider'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'

const getWeb3Modal = (theme: string) => {
  const INFURA_ID = process.env.INFURA_ID
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID
      }
    },
    'custom-coinbase': {
      display: {
        logo: '/coinbase.svg',
        name: 'Coinbase',
        description: 'Scan with WalletLink to connect'
      },
      options: {
        appName: 'Devparty',
        networkUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`
        // chainId: 1
      },
      package: WalletLink,
      connector: async (_: any, options: any) => {
        const { appName, networkUrl, chainId } = options
        const walletLink = new WalletLink({
          appName
        })
        const provider = walletLink.makeWeb3Provider(networkUrl, chainId)
        await provider.enable()
        return provider
      }
    }
  }
  const web3Modal = new Web3Modal({
    network: 'mainnet',
    cacheProvider: false,
    providerOptions,
    theme,
    disableInjectedProvider: false
  })

  return web3Modal
}

export default getWeb3Modal

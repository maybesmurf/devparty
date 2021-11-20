import Torus from '@toruslabs/torus-embed'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { STATIC_ASSETS } from 'src/constants'
import WalletLink from 'walletlink'
import Web3Modal from 'web3modal'

const getWeb3Modal = (theme: string) => {
  const INFURA_ID = process.env.INFURA_ID
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: { infuraId: INFURA_ID }
    },
    torus: { package: Torus },
    'custom-walletlink': {
      display: {
        logo: `${STATIC_ASSETS}/brands/coinbase.svg`,
        name: 'Coinbase',
        description: 'Use the Coinbase Wallet app on your mobile device'
      },
      options: {
        appName: 'Devparty',
        networkUrl:
          'https://mainnet.infura.io/v3/3d19324a72854976a7160e0e2ebc9c2b'
        // chainId: 1
      },
      package: WalletLink,
      connector: async (_: any, options: any) => {
        const { appName, networkUrl, chainId } = options
        const walletLink = new WalletLink({ appName })
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

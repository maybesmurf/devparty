// @ts-ignore
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import { ethers } from 'ethers'

const getENS = async (address: string): Promise<string> => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://cloudflare-eth.com'
  )
  const ensClient = new ENS({ provider, ensAddress: getEnsAddress('1') })
  const ens = await ensClient.getName(address)
  return ens?.name ? ens?.name : address
}

export default getENS

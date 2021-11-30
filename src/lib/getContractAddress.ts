import {
  DEV_CONTRACT_ADDRESS,
  MAINET_CONTRACT_ADDRESS,
  MATIC_CONTRACT_ADDRESS,
  MUMBAI_CONTRACT_ADDRESS,
  RINKEBY_CONTRACT_ADDRESS
} from 'src/constants'

/**
 * Get contract address from the network
 * @param network - Current network
 * @returns the contract address
 */
export const getContractAddress = (network: string) => {
  if (network === 'homestead') {
    return MAINET_CONTRACT_ADDRESS
  } else if (network === 'rinkeby') {
    return RINKEBY_CONTRACT_ADDRESS
  } else if (network === 'matic') {
    return MATIC_CONTRACT_ADDRESS
  } else if (network === 'maticmum') {
    return MUMBAI_CONTRACT_ADDRESS
  } else if (network === 'unknown') {
    return DEV_CONTRACT_ADDRESS
  }
}

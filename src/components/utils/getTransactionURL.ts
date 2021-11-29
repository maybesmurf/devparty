/**
 * Get transaction URL
 * @param network - Current network
 * @param txid - Transaction ID
 * @returns the blockchain transaction url
 */
export const getTransactionURL = (network: string, txid: string) => {
  if (network === 'homestead') {
    return `https://etherscan.io/tx/${txid}`
  } else if (network === 'rinkeby') {
    return `https://rinkeby.etherscan.io/tx/${txid}`
  } else if (network === 'matic') {
    return `https://polygonscan.com/tx/${txid}`
  } else if (network === 'maticmum') {
    return `https://mumbai.polygonscan.com/tx/${txid}`
  } else if (network === 'unknown') {
    return `https://rinkeby.etherscan.io/tx/${txid}`
  }
}

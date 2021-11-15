/**
 * Get opensea path
 * @param network - Current network
 * @param contract - Contract address of the minted NFT
 * @param token - Token ID of the minted NFT
 * @returns the opensea path
 */
export const getOpenSeaPath = (
  network: string,
  contract: string,
  token: string
) => {
  if (network === 'homestead') {
    return `assets/${contract}/${token}`
  } else if (network === 'rinkeby') {
    return `assets/rinkeby/${contract}/${token}`
  } else if (network === 'matic') {
    return `assets/matic/${contract}/${token}`
  } else if (network === 'maticmum') {
    return `assets/mumbai/${contract}/${token}`
  }
}

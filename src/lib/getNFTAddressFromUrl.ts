const getNFTAddressFromUrl = (openSeaUrl: string) => {
  const paths = openSeaUrl.split('/')
  const contractAddress = paths[paths.length - 2]
  const tokenId = paths[paths.length - 1]
  return { contractAddress, tokenId }
}
export default getNFTAddressFromUrl

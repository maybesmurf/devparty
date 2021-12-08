const getENS = async (address: string): Promise<string> => {
  console.log(address)
  const response = await fetch(
    `https://deep-index.moralis.io/api/v2/resolve/${address}/reverse`,
    { headers: { 'X-API-Key': process.env.MORALIS_API_KEY as string } }
  )
  const result = await response.json()
  return result?.name ? result?.name : address
}

export default getENS

export const formatAddressShort = (address: string) => {
  if (!address) return null

  // Skip over ENS names
  if (address.includes('.')) return address

  return `${address.slice(0, 4)}…${address.slice(
    address.length - 4,
    address.length
  )}`
}

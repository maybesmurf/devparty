export const formatAddressShort = (address: string) => {
  // Skip over ENS names
  if (address.includes('.')) return address

  return `${address.slice(0, 4)}…${address.slice(
    address.length - 4,
    address.length
  )}`
}

export const isEthereumAddress = (address: string) => {
  let regex = /^0x[a-fA-F0-9]{40}$/g
  return address.match(regex) ? true : false
}

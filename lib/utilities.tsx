export const formatUsername = (username: string) => {
  if (isEthereumAddress(username)) {
    // Skip over ENS names
    if (username.includes('.')) return username

    return `${username.slice(0, 4)}…${username.slice(
      username.length - 4,
      username.length
    )}`
  } else {
    return username
  }
}

export const isEthereumAddress = (address: string) => {
  let regex = /^0x[a-fA-F0-9]{40}$/g
  return address.match(regex) ? true : false
}

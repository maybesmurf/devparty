/**
 * Upload image to IPFS
 * @param data - File data (images and videos)
 * @returns ipfs URL
 */
export async function uploadToIPFS(data: File) {
  const formData = new FormData()
  formData.append('file', data, 'img')
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'post',
    body: formData
  })
  const { Hash }: { Hash: string } = await upload.json()

  return {
    type: data.type,
    url: `https://ipfs.infura.io/ipfs/${Hash}`
  }
}

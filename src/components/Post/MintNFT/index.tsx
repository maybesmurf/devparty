import { Post } from '@graphql/types.generated'
import { useState } from 'react'

interface Props {
  post: Post
}

const MintNFT: React.FC<Props> = ({ post }) => {
  const [showMintForm, setShowMintForm] = useState<boolean>(false)

  return (
    <>
      <button onClick={() => setShowMintForm(!showMintForm)}>NFT</button>
    </>
  )
}

export default MintNFT

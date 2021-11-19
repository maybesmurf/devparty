import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Post } from '@graphql/types.generated'
import { FingerPrintIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import toast from 'react-hot-toast'

import Mint from './Mint'

interface Props {
  post: Post
}

const MintNFT: React.FC<Props> = ({ post }) => {
  const [showMintForm, setShowMintForm] = useState<boolean>(false)
  const [showMint, setShowMint] = useState<boolean>(true)

  return (
    <Card>
      <CardBody className="space-y-3">
        {showMint ? (
          <>
            {showMintForm ? (
              <div className="space-y-3">
                <div className="font-bold pb-3 border-b dark:border-gray-700">
                  Create NFT
                </div>
                <Mint
                  post={post}
                  setShowMint={setShowMint}
                  setShowMintForm={setShowMintForm}
                />
              </div>
            ) : (
              <>
                <div>
                  Mint this post as NFT in Ethereum or in Polygon network.
                </div>
                <Button
                  icon={<FingerPrintIcon className="h-4 w-4" />}
                  onClick={() => {
                    if (post?.type === 'POST') {
                      setShowMintForm(!showMintForm)
                    } else {
                      toast.error('Minting is available only for posts')
                    }
                  }}
                >
                  Mint NFT
                </Button>
              </>
            )}
          </>
        ) : (
          <div>NFT is now available everywhere 🎉</div>
        )}
      </CardBody>
    </Card>
  )
}

export default MintNFT

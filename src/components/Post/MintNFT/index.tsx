import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Modal } from '@components/UI/Modal'
import { FingerPrintIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { Post } from 'src/__generated__/schema.generated'

import Mint from './Mint'

interface Props {
  post: Post
}

const MintNFT: React.FC<Props> = ({ post }) => {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <Card>
      <CardBody className="space-y-3">
        <div>Mint this post as NFT gas-free in Polygon network</div>
        <Button
          icon={<FingerPrintIcon className="h-4 w-4" />}
          onClick={() => setShowModal(!showModal)}
        >
          Mint NFT
        </Button>
        <Modal
          onClose={() => setShowModal(!showModal)}
          title="NFT Settings"
          show={showModal}
        >
          <Mint post={post} />
        </Modal>
      </CardBody>
    </Card>
  )
}

export default MintNFT

import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { useState } from 'react'

import NFTAvatarsModal from './Modal'

interface Props {
  ethAddress: string
}

const NFTAvatars: React.FC<Props> = ({ ethAddress }) => {
  const [showNFTModal, setShowNFTModal] = useState<boolean>(false)

  return (
    <div>
      <Button
        type="button"
        className="text-xs"
        onClick={() => setShowNFTModal(!showNFTModal)}
      >
        From NFT
      </Button>
      <Modal
        onClose={() => setShowNFTModal(!showNFTModal)}
        title="Pick avatar from OpenSea"
        show={showNFTModal}
      >
        <NFTAvatarsModal ethAddress={ethAddress as string} />
      </Modal>
    </div>
  )
}

export default NFTAvatars

import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import NFTDetail from '@components/User/NFTDetail'
import { Nft } from '@graphql/types.generated'
import { getOpenSeaPath } from '@lib/getOpenSeaPath'
import { useState } from 'react'
import { IS_MAINNET, STATIC_ASSETS } from 'src/constants'

interface Props {
  nft: Nft
}

const ViewNFT: React.FC<Props> = ({ nft }) => {
  const [showNftDetail, setShowNftDetail] = useState(false)

  const nftUrl = `https://${
    IS_MAINNET ? 'opensea.io' : 'testnets.opensea.io'
  }/${getOpenSeaPath(nft?.network, nft?.address, nft?.tokenId)}`

  return (
    <div>
      <Modal
        title="NFT Post Details"
        size="lg"
        show={showNftDetail}
        onClose={() => setShowNftDetail(false)}
      >
        <NFTDetail url={nftUrl} />
      </Modal>
      <Tooltip content="View NFT Details">
        <button className="outline-none" onClick={() => setShowNftDetail(true)}>
          {nft?.network === 'homestead' ||
          nft?.network === 'rinkeby' ||
          nft?.network === 'unknown' ? (
            <img
              className="h-[22px] w-[22px] rounded-full bg-[#a4a4f2] p-1"
              src={`${STATIC_ASSETS}/brands/ethereum.svg`}
              alt="Polygon Logo"
            />
          ) : (
            <img
              className="h-[20px] w-[20px]"
              src={`${STATIC_ASSETS}/brands/polygon.svg`}
              alt="Polygon Logo"
            />
          )}
        </button>
      </Tooltip>
    </div>
  )
}

export default ViewNFT

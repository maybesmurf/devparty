import { Tooltip } from '@components/UI/Tooltip'
import { getOpenSeaPath } from '@components/utils/getOpenSeaPath'
import { Nft } from '@graphql/types.generated'
import { IS_MAINNET, STATIC_ASSETS } from 'src/constants'

interface Props {
  nft: Nft
}

const ViewNFT: React.FC<Props> = ({ nft }) => {
  return (
    <div>
      <Tooltip content="View in Opensea">
        <a
          href={`https://${
            IS_MAINNET ? 'opensea.io' : 'testnets.opensea.io'
          }/${getOpenSeaPath(nft?.network, nft?.address, nft?.tokenId)}`}
          target="_blank"
          rel="noreferrer"
        >
          {nft?.network === 'homestead' || nft?.network === 'rinkeby' ? (
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
        </a>
      </Tooltip>
    </div>
  )
}

export default ViewNFT

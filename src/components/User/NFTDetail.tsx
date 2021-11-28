import getNFTAddressFromUrl from '@components/utils/getNFTAddressFromUrl'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'

type Props = {
  url: string
}

export type NFT = {
  token_id: string
  background_color: null
  image_url: string
  name: string
  description: string
  asset_contract: {
    address: string
  }
  permalink: string
  collection?: {
    name: string
    image_url: string
  }
  traits: Trait[]
}

export type Trait = {
  display_type: string
  trait_count: number
  trait_type: string
  value: number
}

const NFTDetail: React.FC<Props> = ({ url }) => {
  const { contractAddress, tokenId } = getNFTAddressFromUrl(url)
  const [nft, setNft] = useState<NFT>()

  const fetchNftDetail = useCallback(async () => {
    //   `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`
    const response = await fetch(
      'https://api.opensea.io/api/v1/asset/0xef3c951e22c65f6256746f4e227e19a5bcbf393c/867'
    )
    const data = await response.json()
    setNft(data)
  }, [])
  //   }, [contractAddress, tokenId])

  useEffect(() => {
    fetchNftDetail()
  }, [fetchNftDetail])

  return (
    <div>
      <div className="flex flex-row">
        <div className="h-[350px]">
          <img
            src={nft?.image_url}
            className="object-cover h-[350px] rounded-lg"
            alt={nft?.name}
            loading="eager"
          />
        </div>
        <div className="flex-1 space-y-5 px-5">
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h5 className="text-sm opacity-80">About</h5>
              <h1 className="text-2xl font-semibold">{nft?.name}</h1>
              <div className="flex items-center space-x-2">
                <img
                  src={nft?.collection?.image_url}
                  className="object-cover h-5 w-5 rounded-lg"
                  alt=""
                />
                <h6 className="text-sm opacity-50">{nft?.collection?.name}</h6>
              </div>
            </div>
            <button>
              <ExternalLinkIcon className="opacity-60 hover:opacity-100 w-5 h-5" />
            </button>
          </div>
          {nft?.description && (
            <div className="space-y-1">
              <h5 className="text-sm opacity-80">Description</h5>
              <p className="opacity-70">{nft?.description || '~'}</p>
            </div>
          )}
          <div className="space-y-1">
            <h5 className="text-sm opacity-80">Attributes</h5>
            <div className="opacity-70 space-x-2 flex flex-wrap">
              {nft?.traits.map((trait, idx) => (
                <div
                  key={idx}
                  className="py-2 px-4 bg-gray-100 rounded-lg dark:bg-gray-900"
                >
                  <div>
                    <span className="text-xs opacity-80">
                      {trait.trait_type}
                    </span>
                    <h3 className="font-semibold">{trait.value}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Link href={`https://etherscan/token/${nft?.asset_contract.address}`}>
          <a
            target="_blank"
            className="flex items-center space-x-2 hover:underline"
          >
            <span>View the transaction</span>
            <ExternalLinkIcon className="opacity-60 hover:opacity-100 w-5 h-5" />
          </a>
        </Link>
      </div>
    </div>
  )
}

export default NFTDetail

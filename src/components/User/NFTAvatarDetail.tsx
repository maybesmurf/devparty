import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Spinner } from '@components/UI/Spinner'
import getNFTAddressFromUrl from '@components/utils/getNFTAddressFromUrl'
import Markdown from 'markdown-to-jsx'
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

const NFTAvatarDetail: React.FC<Props> = ({ url }) => {
  const { contractAddress, tokenId } = getNFTAddressFromUrl(url)
  const [nft, setNft] = useState<NFT>()

  const fetchNftDetail = useCallback(async () => {
    const response = await fetch(
      `https://api.opensea.io/api/v1/asset/${contractAddress}/${tokenId}`
    )
    const data = await response.json()
    setNft(data)
  }, [contractAddress, tokenId])

  useEffect(() => {
    fetchNftDetail()
  }, [fetchNftDetail])

  if (!nft)
    return (
      <div className="p-5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading avatar details from OpenSea</div>
      </div>
    )

  return (
    <GridLayout className="!p-5 max-h-[80vh] overflow-y-auto">
      <GridItemFour className="h-[350px] mb-5 sm:mb-0">
        <img
          src={nft?.image_url}
          className="object-cover h-[350px] rounded-lg"
          alt={nft?.name}
        />
      </GridItemFour>
      <GridItemEight className="flex-1 space-y-5">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <img
              src={nft?.collection?.image_url}
              className="object-cover h-5 w-5 rounded-lg"
              alt={nft?.collection?.name}
            />
            <div className="text-sm opacity-50">{nft?.collection?.name}</div>
          </div>
          <h1 className="text-2xl font-semibold">{nft?.name}</h1>
        </div>
        {nft?.description && (
          <div className="space-y-2 linkify">
            <div className="text-lg text-gray-700 dark:text-gray-300 font-bold">
              Description
            </div>
            <Markdown options={{ wrapper: 'article' }}>
              {nft?.description}
            </Markdown>
          </div>
        )}
        {(nft?.traits.length as number) > 0 && (
          <div className="space-y-2">
            <div className="text-lg text-gray-700 dark:text-gray-300 font-bold">
              Attributes
            </div>
            <div className="gap-3 flex flex-wrap">
              {nft?.traits.map((trait, idx) => (
                <div
                  key={idx}
                  className="px-4 py-1 bg-gray-200 rounded-lg dark:bg-gray-900 text-gray-700 dark:text-gray-300"
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
        )}
      </GridItemEight>
    </GridLayout>
  )
}

export default NFTAvatarDetail

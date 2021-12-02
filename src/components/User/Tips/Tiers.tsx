import { TipTier } from '@graphql/types.generated'
import { aggregatorV3InterfaceABI } from '@lib/abis/aggregatorV3InterfaceABI'
import { BigNumber, ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { MAINNET_RPC } from 'src/constants'

import SingleTier from './SingleTier'

interface Props {
  tiers: TipTier[]
  address: string
}

const TipTiers: React.FC<Props> = ({ tiers, address }) => {
  const [ethPrice, setEthPrice] = useState<string>('')

  useEffect(() => {
    loadPriceOracle()
  })

  const loadPriceOracle = () => {
    const provider = new ethers.providers.JsonRpcProvider(MAINNET_RPC)
    const addr = 'eth-usd.data.eth'
    const priceFeed = new ethers.Contract(
      addr,
      aggregatorV3InterfaceABI,
      provider
    )
    priceFeed.latestRoundData().then((roundData: any) => {
      setEthPrice(
        (BigNumber.from(roundData[1]).toNumber() / 10 ** 8).toString()
      )
    })
  }

  return (
    <div className="mt-5">
      <div className="text-lg font-bold">Tip via Devparty</div>
      <div className="mt-5 border-b" />
      <div className="!mt-0 divide-y">
        {tiers?.map((tier) => (
          <SingleTier
            ethPrice={ethPrice}
            key={tier?.id}
            tier={tier as TipTier}
            address={address}
          />
        ))}
      </div>
    </div>
  )
}

export default TipTiers

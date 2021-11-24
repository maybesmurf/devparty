import { TipTier } from '@graphql/types.generated'
import React from 'react'
import useSWR from 'swr'

import SingleTier from './SingleTier'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Props {
  tiers: TipTier[]
  address: string
}

const TipTiers: React.FC<Props> = ({ tiers, address }) => {
  const { data } = useSWR(
    'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=eth',
    fetcher
  )

  return (
    <div className="mt-5">
      <div className="text-lg font-bold">Tip via Devparty</div>
      <div className="mt-5 border-b" />
      <div className="!mt-0 divide-y">
        {tiers?.map((tier) => (
          <SingleTier
            convData={data}
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

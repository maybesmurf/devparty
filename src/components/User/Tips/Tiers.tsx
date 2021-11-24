import { TipTier } from '@graphql/types.generated'
import React from 'react'

import SingleTier from './SingleTier'

interface Props {
  tiers: TipTier[]
  address: string
}

const TipTiers: React.FC<Props> = ({ tiers, address }) => {
  return (
    <div className="mt-5">
      <div className="text-lg font-bold">Tip via Devparty</div>
      <div className="mt-5 border-b" />
      <div className="!mt-0 divide-y">
        {tiers?.map((tier) => (
          <SingleTier key={tier?.id} tier={tier as TipTier} address={address} />
        ))}
      </div>
    </div>
  )
}

export default TipTiers

import { TipTier } from '@graphql/types.generated'
import React from 'react'

interface Props {
  tier: TipTier
}

const SingleTier: React.FC<Props> = ({ tier }) => {
  return (
    <div className="py-5 space-y-3">
      <div className="text-lg font-bold">{tier?.amount} Ξ one time</div>
      <div className="text-lg font-bold">{tier?.name}</div>
      <div>{tier?.description}</div>
    </div>
  )
}

export default SingleTier

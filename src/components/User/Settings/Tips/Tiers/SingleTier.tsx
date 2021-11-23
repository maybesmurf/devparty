import { TipTier } from '@graphql/types.generated'
import React from 'react'

interface Props {
  tier: TipTier
}

const SingleTier: React.FC<Props> = ({ tier }) => {
  return (
    <div>
      <div>{tier?.description}</div>
    </div>
  )
}

export default SingleTier

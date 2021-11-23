import { Button } from '@components/UI/Button'
import { TipTier } from '@graphql/types.generated'
import { TrashIcon } from '@heroicons/react/outline'
import React from 'react'

interface Props {
  tier: TipTier
}

const SingleTier: React.FC<Props> = ({ tier }) => {
  return (
    <div className="py-5 space-y-3 flex items-start space-x-5">
      <div className="space-y-3">
        <div className="text-lg font-bold">{tier?.amount} Ξ one time</div>
        <div className="text-lg font-bold">{tier?.name}</div>
        <div>{tier?.description}</div>
      </div>
      <Button
        variant="danger"
        size="sm"
        className="text-sm"
        icon={<TrashIcon className="h-4 w-4" />}
      >
        Delete
      </Button>
    </div>
  )
}

export default SingleTier

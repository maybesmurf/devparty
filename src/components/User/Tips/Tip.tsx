import { Button } from '@components/UI/Button'
import { TipTier } from '@graphql/types.generated'
import { HeartIcon } from '@heroicons/react/outline'
import React from 'react'

interface Props {
  tier: TipTier
}

const Tip: React.FC<Props> = ({ tier }) => {
  return (
    <Button variant="danger" icon={<HeartIcon className="h-5 2-5" />} outline>
      Tip
    </Button>
  )
}

export default Tip

import { Button } from '@components/UI/Button'
import { TipTier } from '@graphql/types.generated'
import { HeartIcon } from '@heroicons/react/outline'
import Markdown from 'markdown-to-jsx'
import React from 'react'

interface Props {
  tier: TipTier
}

const SingleTier: React.FC<Props> = ({ tier }) => {
  return (
    <div className="py-5 space-y-3 flex items-start justify-between space-x-5">
      <div className="space-y-3">
        <div className="text-lg font-bold">{tier?.amount} Ξ one time</div>
        <div className="text-lg font-bold">{tier?.name}</div>
        <div className="prose dark:prose-dark">
          <Markdown options={{ wrapper: 'article' }}>
            {tier?.description}
          </Markdown>
        </div>
      </div>
      <Button icon={<HeartIcon className="h-5 2-5" />} outline>
        Tip
      </Button>
    </div>
  )
}

export default SingleTier

import { TipTier } from '@graphql/types.generated'
import Markdown from 'markdown-to-jsx'
import dynamic from 'next/dynamic'
import React from 'react'

const Tip = dynamic(() => import('./Tip'), {
  loading: () => <div className="w-20 h-9 rounded-lg shimmer" />
})

interface Props {
  tier: TipTier
  address: string
}

const SingleTier: React.FC<Props> = ({ tier, address }) => {
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
      <Tip tier={tier} address={address} />
    </div>
  )
}

export default SingleTier

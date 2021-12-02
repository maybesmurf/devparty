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
  ethPrice: string
}

const SingleTier: React.FC<Props> = ({ tier, address, ethPrice }) => {
  return (
    <div className="py-5 space-y-3 flex items-start justify-between space-x-5">
      <div className="space-y-3">
        <div>
          <div className="text-lg font-bold">${tier?.amount}</div>
          <div className="text-gray-500 font-light text-sm flex items-center space-x-1">
            {ethPrice ? (
              <div>{(tier?.amount / parseInt(ethPrice)).toFixed(5)}</div>
            ) : (
              <div className="shimmer h-4 w-7 rounded" />
            )}
            <div>ETH</div>
          </div>
        </div>
        <div className="text-lg font-bold">{tier?.name}</div>
        <div className="prose dark:prose-dark">
          <Markdown options={{ wrapper: 'article' }}>
            {tier?.description}
          </Markdown>
        </div>
      </div>
      <Tip
        tier={tier}
        address={address}
        eth={ethPrice && ((tier?.amount / parseInt(ethPrice)) as any)}
      />
    </div>
  )
}

export default SingleTier

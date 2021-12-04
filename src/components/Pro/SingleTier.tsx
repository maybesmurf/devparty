import clsx from 'clsx'
import Markdown from 'markdown-to-jsx'
import dynamic from 'next/dynamic'
import React from 'react'

const Subscribe = dynamic(() => import('./Subscribe'), {
  loading: () => <div className="w-20 h-9 rounded-lg shimmer" />
})

interface Props {
  name: string
  amount: string
  usdPrice: string
  validity: string
  preferred: boolean
  bgImage: string
  tiers: string[]
}

const SingleTier: React.FC<Props> = ({
  name,
  amount,
  usdPrice,
  validity,
  preferred,
  bgImage,
  tiers
}) => {
  const usd = (parseFloat(usdPrice) * parseFloat(amount)).toFixed(2)

  return (
    <div
      className={clsx(
        'relative mx-auto flex flex-col max-w-xs w-full items-center p-2 overflow-hidden dark:bg-gray-800 bg-white rounded-lg lg:items-start border',
        { 'transform md:scale-110': preferred }
      )}
    >
      <div
        style={{
          backgroundImage: `url(https://assets.devparty.io/images/patterns/${bgImage}.svg)`,
          backgroundSize: '200%'
        }}
        className="object-cover shadow bg-brand-300 rounded-t-lg p-5 w-full"
      >
        <div className="text-lg font-bold text-black md:text-2xl">{name}</div>
        <div className="text-lg text-black">{validity}</div>
      </div>
      <div className="p-4 space-y-5 w-full">
        <div className="font-bold space-y-2">
          <div className="text-3xl inline-flex items-center space-x-2">
            <img
              className="h-5 w-5"
              src="https://assets.devparty.io/images/brands/polygon.svg"
              alt="Polygon Logo"
            />
            <span>
              {amount}{' '}
              <span className="text-sm font-normal text-gray-500">
                one time
              </span>
            </span>
          </div>
          {usdPrice ? (
            <div className="text-gray-500">{usd} USD</div>
          ) : (
            <div className="shimmer h-4 w-10 rounded mx-auto" />
          )}
        </div>

        <ul className="space-y-2 text-gray-500">
          {tiers.map((tier) => (
            <li key={Math.random()}>
              <Markdown options={{ wrapper: 'article' }}>{tier}</Markdown>
            </li>
          ))}
        </ul>
        <Subscribe amount={amount} />
      </div>
    </div>
  )
}

export default SingleTier

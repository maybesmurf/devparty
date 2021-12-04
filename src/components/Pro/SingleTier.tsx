import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React from 'react'

const Subscribe = dynamic(() => import('./Subscribe'), {
  loading: () => <div className="w-20 h-9 rounded-lg shimmer" />
})

interface Props {
  amount: string
  usdPrice: string
  validity: string
  preferred: boolean
  bgImage: string
}

const SingleTier: React.FC<Props> = ({
  amount,
  usdPrice,
  validity,
  preferred,
  bgImage
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
        className="flex object-cover shadow bg-brand-300 rounded-t-lg p-6 flex-row justify-center w-full items-center"
      >
        <div className="text-lg text-center text-black leading-snug text-light md:text-2xl">
          {validity}
        </div>
      </div>
      <div className="p-4 space-y-5">
        <div className="font-bold space-y-2">
          <div className="text-3xl inline-flex items-center space-x-2">
            <img
              className="h-5 w-5"
              src="https://assets.devparty.io/images/brands/polygon.svg"
              alt="Polygon Logo"
            />
            <span>{amount}</span>
          </div>
          {usdPrice ? (
            <div className="text-gray-500">{usd} USD</div>
          ) : (
            <div className="shimmer h-4 w-10 rounded mx-auto" />
          )}
        </div>
        <ul className="text-left !list-disc !list-inside space-y-2 w-full text-gray-400">
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
        </ul>
        <Subscribe amount={amount} />
      </div>
    </div>
  )
}

export default SingleTier

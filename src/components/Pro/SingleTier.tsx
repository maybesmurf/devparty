import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React from 'react'

const Subscribe = dynamic(() => import('./Subscribe'), {
  loading: () => <div className="w-20 h-9 rounded-lg shimmer" />
})

interface Props {
  preferred: boolean
  bgImage: string
  validity: string
  amount: string
}

const SingleTier: React.FC<Props> = ({
  preferred,
  bgImage,
  validity,
  amount
}) => {
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
        <div className="text-center text-5xl font-bold">
          <span className="text-3xl">Ξ</span> {amount}
        </div>
        <ul className="text-left !list-disc !list-inside space-y-2 w-full text-gray-400">
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
          <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
        </ul>
        <Subscribe amount={amount} eth={1.0} />
      </div>
    </div>
  )
}

export default SingleTier

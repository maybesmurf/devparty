import React from 'react'

import { Spinner } from './Spinner'

export const PageLoading: React.FC = () => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <Spinner />
    </div>
  )
}

import AppContext from '@components/utils/AppContext'
import { formatUsername } from '@components/utils/formatUsername'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'

import Slug from '../Slug'

const Masquerading: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  return (
    <div className="bg-yellow-200 dark:bg-yellow px-3 py-2 flex justify-between text-sm font-bold">
      <div className="mx-auto flex items-center space-x-2">
        <SwitchHorizontalIcon className="h-5 w-5" />
        <div>
          You are masquerading into{' '}
          <Slug
            slug={formatUsername(currentUser?.username as string)}
            prefix="@"
          />
          's account
        </div>
      </div>
    </div>
  )
}

export default Masquerading

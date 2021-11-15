import { Tooltip } from '@components/UI/Tooltip'
import Follow from '@components/User/Follow'
import AppContext from '@components/utils/AppContext'
import { imagekitURL } from '@components/utils/imagekitURL'
import { User } from '@graphql/types.generated'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import React, { useContext } from 'react'

import Slug from './Slug'

interface Props {
  user: User
  showFollow?: boolean
}

const UserProfile: React.FC<Props> = ({ user, showFollow = false }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-3 items-center">
        <img
          src={imagekitURL(user?.profile?.avatar as string, 100, 100)}
          className="h-11 w-11 rounded-full bg-gray-200"
          alt={`@${user?.username}`}
        />
        <div>
          <div className="flex items-center gap-1.5">
            <Link href={`/u/${user?.username}`} passHref>
              <a
                href={`/u/${user?.username}`}
                className="font-bold cursor-pointer flex items-center space-x-1"
              >
                <div>{user?.profile?.name}</div>
                {user?.isVerified && (
                  <Tooltip content={'Verified'}>
                    <BadgeCheckIcon className="h-4 w-4 text-brand-500" />
                  </Tooltip>
                )}
                {user?.status?.emoji && (
                  <Tooltip content={user?.status?.text}>
                    <div className="text-xs">{user?.status?.emoji}</div>
                  </Tooltip>
                )}
              </a>
            </Link>
          </div>
          <Slug slug={user?.username} prefix="@" />
        </div>
      </div>
      {currentUser && showFollow && <Follow user={user} showText={false} />}
    </div>
  )
}

export default UserProfile

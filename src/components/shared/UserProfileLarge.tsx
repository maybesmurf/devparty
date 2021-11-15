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
  showToast?: boolean
}

const UserProfileLarge: React.FC<Props> = ({
  user,
  showFollow = false,
  showToast = true
}) => {
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex justify-between items-center space-x-5">
      <div className="flex space-x-4 items-center">
        <img
          src={imagekitURL(user?.profile?.avatar as string, 100, 100)}
          className="h-14 w-14 rounded-full bg-gray-200"
          alt={`@/${user?.username}`}
        />
        <div className="space-y-2">
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
            <div className="flex items-center space-x-2">
              <Slug slug={user?.username} prefix="@" />
              {user?.isFollowing && (
                <span className="text-xs bg-gray-200 dark:bg-gray-800 border py-0.5 px-1.5 rounded-md">
                  Follows you
                </span>
              )}
            </div>
          </div>
          <div>{user?.profile?.bio}</div>
        </div>
      </div>
      {currentUser && showFollow && (
        <Follow user={user} showText showToast={showToast} />
      )}
    </div>
  )
}

export default UserProfileLarge

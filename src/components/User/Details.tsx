import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Tooltip } from '@components/UI/Tooltip'
import AppContext from '@components/utils/AppContext'
import { useENS } from '@components/utils/hooks/useENS'
import { imagekitURL } from '@components/utils/imagekitURL'
import { linkifyOptions } from '@components/utils/linkifyOptions'
import { Profile, User } from '@graphql/types.generated'
import {
  ClockIcon,
  FireIcon,
  LocationMarkerIcon,
  PencilIcon,
  SupportIcon
} from '@heroicons/react/outline'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import { formatUsername } from '@lib/utilities'
import Linkify from 'linkify-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useContext } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { STATIC_ASSETS } from 'src/constants'
import * as timeago from 'timeago.js'

import Badges from './Badges'
import Follow from './Follow'
import Followerings from './Followerings'
import Spotify from './Highlights/Spotify'
import Wakatime from './Highlights/Wakatime'
import OwnedProducts from './OwnedProducts'
import Social from './Social'
import Tips from './Tips'

const UserMod = dynamic(() => import('./Mod'))

interface Props {
  user: User
}

const Details: React.FC<Props> = ({ user }) => {
  const { currentUser, currentUserLoading, staffMode } = useContext(AppContext)
  const { name: ensName } = useENS(user)

  return (
    <div className="mb-4">
      <div className="px-5 sm:px-0 space-y-5">
        <div className="relative w-28 h-28 sm:h-40 sm:w-40 -mt-24">
          <img
            className="rounded-full ring-8 w-28 h-28 sm:h-40 sm:w-40 bg-gray-200 dark:bg-gray-700 ring-gray-50 dark:ring-black"
            src={imagekitURL(user?.profile?.avatar as string, 200, 200)}
            alt={`@${user?.username}`}
          />
          {user?.profile?.nftSource && (
            <a href={user?.profile?.nftSource} target="_blank" rel="noreferrer">
              <img
                className="absolute bottom-0 right-0 h-9 w-9 my-1 border-4 border-white rounded-full bg-[#a4a4f2] p-1.5"
                src={`${STATIC_ASSETS}/brands/ethereum.svg`}
                alt="Ethereum Logo"
              />
            </a>
          )}
        </div>
        <div>
          <div className="text-2xl font-bold flex items-center gap-1.5">
            <div className="truncate">{user?.profile?.name}</div>
            {user?.isVerified && (
              <Tooltip content={'Verified'}>
                <BadgeCheckIcon className="h-6 w-6 text-brand-500" />
              </Tooltip>
            )}
            {user?.featuredAt && (
              <Tooltip content={'Featured User'}>
                <FireIcon className="h-6 w-6 text-yellow-500" />
              </Tooltip>
            )}
            {user?.isStaff && (
              <Tooltip content={'Staff'}>
                <SupportIcon className="h-6 w-6 text-yellow-600" />
              </Tooltip>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Slug
              slug={formatUsername(user?.username)}
              prefix="@"
              className="text-xl truncate"
            />
            {user?.isFollowing && (
              <span className="text-xs bg-gray-200 dark:bg-gray-800 border py-0.5 px-1.5 rounded-md">
                Follows you
              </span>
            )}
            {ensName && (
              <CopyToClipboard
                text={ensName}
                onCopy={() => {
                  toast.success('ENS name copied!')
                }}
              >
                <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 shadown-sm rounded-full border dark:border-gray-700 text-xs px-3 py-0.5 w-max cursor-pointer">
                  <img
                    className="h-3 w-3"
                    src="https://assets.devparty.io/images/brands/ens.svg"
                    alt="ENS logo"
                  />
                  <div>{ensName}</div>
                </div>
              </CopyToClipboard>
            )}
          </div>
        </div>
        {user?.status?.emoji && (
          <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 shadown-sm rounded-lg border dark:border-gray-700 text-sm px-3 py-1 w-max">
            <div>{user?.status?.emoji}</div>
            <div>{user?.status?.text}</div>
          </div>
        )}
        <Followerings user={user} />
        {currentUserLoading ? (
          <div className="shimmer rounded-lg h-7 w-20" />
        ) : (
          <div className="flex items-center space-x-2">
            {currentUser?.id !== user?.id ? (
              <Follow user={user} showText={true} />
            ) : (
              <Link href="/settings/profile" passHref>
                <a href="/settings/profile">
                  <Button
                    size="md"
                    variant="success"
                    className="text-sm"
                    icon={<PencilIcon className="h-4 w-4" />}
                  >
                    Edit Profile
                  </Button>
                </a>
              </Link>
            )}
            {user?.tip && <Tips user={user} />}
          </div>
        )}
        {user?.profile?.bio && (
          <div className="linkify">
            <Linkify options={linkifyOptions}>{user?.profile?.bio}</Linkify>
          </div>
        )}
        <div className="space-y-1">
          {user?.profile?.location && (
            <div className="flex items-center gap-2">
              <LocationMarkerIcon className="h-4 w-4" />
              <div>{user?.profile?.location}</div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4" />
            <div>{timeago.format(user?.createdAt)}</div>
          </div>
        </div>
        <Social profile={user?.profile as Profile} />
        <OwnedProducts user={user} />
        {user?.hasWakatimeIntegration && <Wakatime user={user} />}
        {user?.hasSpotifyIntegration && <Spotify user={user} />}
        <Badges user={user} />
      </div>
      {currentUser?.isStaff && staffMode && (
        <>
          {user?.spammy && (
            <ErrorMessage
              title="Oops!"
              error={new Error('This user is marked as spammy!')}
            />
          )}
          <UserMod user={user} />
        </>
      )}
    </div>
  )
}

export default Details

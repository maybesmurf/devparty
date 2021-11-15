import AppContext from '@components/utils/AppContext'
import { User } from '@graphql/types.generated'
import {
  BookmarkIcon,
  CollectionIcon,
  CubeIcon,
  DocumentTextIcon,
  UsersIcon
} from '@heroicons/react/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

interface TabProps {
  children: React.ReactNode
  current: boolean
  url: string
}

const Tab: React.FC<TabProps> = ({ children, current, url }) => (
  <Link href={url} passHref>
    <a
      href={url}
      className={clsx(
        'flex items-center space-x-2 rounded-lg px-3 py-1 text-gray-500 hover:bg-purple-100 hover:text-purple-500 dark:hover:bg-opacity-20 hover:bg-opacity-100',
        { 'bg-brand-100 text-brand-500 font-bold': current }
      )}
    >
      {children}
    </a>
  </Link>
)

interface Props {
  user: User
}

const PageType: React.FC<Props> = ({ user }) => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)

  return (
    <div className="flex gap-3 px-2 sm:px-0 mt-0 sm:-mt-2">
      <Tab
        current={router.pathname == '/u/[username]'}
        url={`/u/${user?.username}`}
      >
        <CollectionIcon className="h-4 w-4" />
        <div
          className={
            router.pathname == '/u/[username]' ? '' : `hidden sm:block`
          }
        >
          Posts
        </div>
      </Tab>
      <Tab
        current={router.pathname == '/u/[username]/products'}
        url={`/u/${user?.username}/products`}
      >
        <CubeIcon className="h-4 w-4" />
        <div
          className={
            router.pathname == '/u/[username]/products' ? '' : `hidden sm:block`
          }
        >
          Products
        </div>
      </Tab>
      <Tab
        current={router.pathname == '/u/[username]/communities'}
        url={`/u/${user?.username}/communities`}
      >
        <UsersIcon className="h-4 w-4" />
        <div
          className={
            router.pathname == '/u/[username]/communities'
              ? ''
              : `hidden sm:block`
          }
        >
          Communities
        </div>
      </Tab>
      {user?.id === currentUser?.id && (
        <Tab
          current={router.pathname == '/u/[username]/bookmarks'}
          url={`/u/${user?.username}/bookmarks`}
        >
          <BookmarkIcon className="h-4 w-4" />
          <div
            className={
              router.pathname == '/u/[username]/bookmarks'
                ? ''
                : `hidden sm:block`
            }
          >
            Bookmarks
          </div>
        </Tab>
      )}
      <Tab
        current={router.pathname == '/u/[username]/readme'}
        url={`/u/${user?.username}/readme`}
      >
        <DocumentTextIcon className="h-4 w-4" />
        <div
          className={
            router.pathname == '/u/[username]/readme' ? '' : `hidden sm:block`
          }
        >
          Readme
        </div>
      </Tab>
    </div>
  )
}

export default PageType

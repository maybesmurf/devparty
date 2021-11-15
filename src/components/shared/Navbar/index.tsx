import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext, useState } from 'react'

import BetaBadge from '../BetaBadge'
import MenuItems from './MenuItems'
import MoreNavItems from './MoreNavItems'
import Notification from './Notification'
import Search from './Search'

const Invite = dynamic(() => import('./Invite'))
const StaffBar = dynamic(() => import('./StaffBar'))
const Masquerading = dynamic(() => import('./Masquerading'))
const SetStatus = dynamic(() => import('./SetStatus'))

const Navbar: React.FC = () => {
  const [showStatusModal, setShowStatusModal] = useState<boolean>(false)
  const { currentUser, currentUserLoading, staffMode } = useContext(AppContext)

  interface NavItemProps {
    url: string
    name: string
    current: boolean
  }

  const NavItem = ({ url, name, current }: NavItemProps) => {
    return (
      <Link href={url} passHref>
        <a
          href={url}
          className={clsx('px-3 py-1 rounded-md font-black cursor-pointer', {
            'text-black dark:text-white bg-gray-200 dark:bg-gray-800': current,
            'text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800':
              !current
          })}
          aria-current={current ? 'page' : undefined}
        >
          {name}
        </a>
      </Link>
    )
  }

  const NavItems = () => {
    const router = useRouter()

    return (
      <>
        <NavItem
          url={currentUser ? '/home' : '/'}
          name="Home"
          current={router.pathname == '/home'}
        />
        <NavItem
          url="/products"
          name="Products"
          current={router.pathname == '/products'}
        />
        <NavItem
          url="/explore"
          name="Explore"
          current={router.pathname == '/explore'}
        />
        <MoreNavItems />
      </>
    )
  }

  return (
    <nav className="bg-white dark:bg-gray-800 bg-opacity-70 dark:bg-opacity-70 backdrop-filter backdrop-blur-lg backdrop-saturate-150 w-full shadow sticky top-0 z-10">
      {currentUser?.masquerading && <Masquerading />}
      {currentUser?.isStaff && staffMode && <StaffBar />}
      <div className="container mx-auto max-w-screen-2xl px-5">
        <div className="relative flex items-center justify-between h-14 sm:h-16">
          <div className="flex-1 flex items-center justify-start">
            <div className="flex-shrink-0 flex items-center space-x-3">
              <Link href={currentUser ? '/home' : '/'} passHref>
                <a href={currentUser ? '/home' : '/'}>
                  <img
                    className="block h-8 sm:h-9 w-auto cursor-pointer"
                    src="/logo.svg"
                    alt="Devparty"
                  />
                </a>
              </Link>
              <BetaBadge />
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex items-center space-x-4">
                <div className="hidden md:block">
                  <Search />
                </div>
                <NavItems />
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {currentUserLoading ? (
              <div className="shimmer rounded-full h-8 w-8 sm:h-10 sm:w-10" />
            ) : currentUser ? (
              <div className="flex items-center gap-5">
                <div className="hidden md:block">
                  <Invite />
                </div>
                <div className="hidden md:block">
                  <Notification />
                </div>
                <MenuItems
                  setShowStatusModal={setShowStatusModal}
                  currentUser={currentUser}
                />
                <SetStatus
                  showStatusModal={showStatusModal}
                  setShowStatusModal={setShowStatusModal}
                />
              </div>
            ) : (
              <div className="space-x-4 flex">
                <div className="hidden sm:block">
                  <Link href="/signup" passHref>
                    <a href="/signup">
                      <Button size="lg" variant="primary">
                        Signup
                      </Button>
                    </a>
                  </Link>
                </div>
                <div>
                  <Link href="/login" passHref>
                    <a href="/login">
                      <Button size="lg" variant="success">
                        Login
                      </Button>
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

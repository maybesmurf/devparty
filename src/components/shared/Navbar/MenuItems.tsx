import AppContext from '@components/utils/AppContext'
import { imagekitURL } from '@components/utils/imagekitURL'
import { User } from '@graphql/types.generated'
import { Menu, Transition } from '@headlessui/react'
import {
  CogIcon,
  EmojiHappyIcon,
  LogoutIcon,
  UserIcon
} from '@heroicons/react/outline'
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/solid'
import clsx from 'clsx'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Fragment, useContext } from 'react'

import Slug from '../Slug'

const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href} passHref>
    <a {...rest}>{children}</a>
  </Link>
)

interface Props {
  currentUser: User
  setShowStatusModal: React.Dispatch<React.SetStateAction<boolean>>
}

const MenuItems: React.FC<Props> = ({ currentUser, setShowStatusModal }) => {
  const { theme, setTheme } = useTheme()
  const { staffMode, setStaffMode } = useContext(AppContext)
  const status = currentUser?.status

  const toggleStaffMode = () => {
    localStorage.setItem('staffMode', String(!staffMode))
    setStaffMode(!staffMode)
  }

  return (
    <Menu as="div">
      {({ open }) => (
        <>
          <Menu.Button className="flex items-center gap-2">
            <img
              className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gray-200"
              src={imagekitURL(
                currentUser?.profile?.avatar as string,
                100,
                100
              )}
              alt={`@${currentUser?.username}`}
            />
          </Menu.Button>
          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              static
              className="origin-top-right absolute right-0 w-48 rounded-lg shadow-sm py-1 bg-white dark:bg-gray-900 focus:outline-none mt-2 border dark:border-gray-800"
            >
              <Menu.Item
                as={NextLink}
                href={`/u/${currentUser?.username}`}
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                  )
                }
              >
                <div>
                  <div className="font-bold">Signed in as</div>
                  <div className="truncate">
                    <Slug slug={currentUser?.username} prefix="@" />
                  </div>
                </div>
              </Menu.Item>
              <div className="border-b dark:border-gray-800" />
              <Menu.Item
                as={'div'}
                onClick={() => setShowStatusModal(true)}
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer border dark:border-gray-700'
                  )
                }
              >
                {status?.emoji ? (
                  <div className="flex items-center space-x-1.5">
                    <div>{status?.emoji}</div>
                    <div className="truncate" title={status?.text}>
                      {status?.text}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1.5">
                    <EmojiHappyIcon className="h-4 w-4" />
                    <div>Set status</div>
                  </div>
                )}
              </Menu.Item>
              <div className="border-b dark:border-gray-800" />
              <Menu.Item
                as={NextLink}
                href={`/u/${currentUser?.username}`}
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                  )
                }
              >
                <div className="flex items-center space-x-1.5">
                  <UserIcon className="h-4 w-4" />
                  <div>Your Profile</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as={NextLink}
                href="/settings/profile"
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                  )
                }
              >
                <div className="flex items-center space-x-1.5">
                  <CogIcon className="h-4 w-4" />
                  <div>Settings</div>
                </div>
              </Menu.Item>
              <Menu.Item
                as="a"
                href="/api/logout"
                className={({ active }: { active: boolean }) =>
                  clsx(
                    { 'bg-gray-100 dark:bg-gray-800': active },
                    'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                  )
                }
              >
                <div className="flex items-center space-x-1.5">
                  <LogoutIcon className="h-4 w-4" />
                  <div>Logout</div>
                </div>
              </Menu.Item>
              <div className="border-b dark:border-gray-800" />
              <div className="px-5 py-3 flex items-center space-x-3">
                <button
                  onClick={() => setTheme('light')}
                  className={theme === 'light' ? 'text-xl' : ''}
                >
                  🌞
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={theme === 'dark' ? 'text-xl' : ''}
                >
                  🌚
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={theme === 'system' ? 'text-xl' : ''}
                >
                  💻
                </button>
              </div>
              {currentUser?.isStaff && (
                <>
                  <div className="border-b dark:border-gray-800" />
                  <Menu.Item
                    as="div"
                    onClick={toggleStaffMode}
                    className={({ active }: { active: boolean }) =>
                      clsx(
                        { 'bg-yellow-100 dark:bg-yellow-800': active },
                        'block px-4 py-1.5 text-sm text-gray-700 dark:text-gray-200 m-2 rounded-lg cursor-pointer'
                      )
                    }
                  >
                    {staffMode ? (
                      <div className="flex items-center space-x-1.5">
                        <div>Disable staff mode</div>
                        <ShieldExclamationIcon className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1.5">
                        <div>Enable staff mode</div>
                        <ShieldCheckIcon className="h-4 w-4 text-red-500" />
                      </div>
                    )}
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default MenuItems

import {
  BadgeCheckIcon,
  ChartSquareBarIcon,
  ShieldExclamationIcon,
  UsersIcon
} from '@heroicons/react/outline'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface MenuProps {
  children: React.ReactNode
  current: boolean
  url: string
}

const Menu: React.FC<MenuProps> = ({ children, current, url }) => (
  <Link href={url} passHref>
    <a
      href={url}
      className={clsx(
        'flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-brand-100 hover:text-brand-500 dark:hover:bg-opacity-20 dark:bg-opacity-20 hover:bg-opacity-100',
        { 'bg-brand-100 text-brand-500 font-bold': current }
      )}
    >
      {children}
    </a>
  </Link>
)

const Sidebar: React.FC = () => {
  const router = useRouter()

  return (
    <div className="space-y-1.5 mb-4 px-3 sm:px-0">
      <Menu current={router.pathname == '/stafftools'} url="/stafftools">
        <ChartSquareBarIcon className="h-4 w-4" />
        <div>Dashboard</div>
      </Menu>
      <Menu
        current={router.pathname == '/stafftools/users'}
        url="/stafftools/users"
      >
        <UsersIcon className="h-4 w-4" />
        <div>Users</div>
      </Menu>
      <Menu
        current={router.pathname == '/stafftools/reports'}
        url="/stafftools/reports"
      >
        <ShieldExclamationIcon className="h-4 w-4" />
        <div>Reports</div>
      </Menu>
      <Menu
        current={router.pathname == '/stafftools/badges'}
        url="/stafftools/badges"
      >
        <BadgeCheckIcon className="h-4 w-4" />
        <div>Badges</div>
      </Menu>
    </div>
  )
}

export default Sidebar

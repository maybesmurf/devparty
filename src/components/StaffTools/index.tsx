import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { humanize } from '@components/utils/humanize'
import { GetStaffStatsQuery } from '@graphql/types.generated'
import {
  BellIcon,
  ChipIcon,
  CollectionIcon,
  CubeIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  GlobeIcon,
  HashtagIcon,
  HeartIcon,
  IdentificationIcon,
  LoginIcon,
  ServerIcon,
  ShieldExclamationIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/outline'
import React from 'react'

import Sidebar from './Sidebar'

export const GET_STAFF_STATS_QUERY = gql`
  query GetStaffStats {
    stats {
      users
      products
      communities
      posts
      likes
      topics
      badges
      notifications
      sessions
      reports
    }
  }
`

interface StatProps {
  icon: React.ReactNode
  count: number
  name: string
}

const Stat = ({ icon, count, name }: StatProps) => (
  <div className="flex items-center space-x-1.5">
    {icon}
    <div>
      <span className="font-bold">{humanize(count)}</span> {name}
    </div>
  </div>
)

interface ServiceProps {
  icon: React.ReactNode
  url: string
  name: string
}

const Service = ({ icon, url, name }: ServiceProps) => (
  <div className="flex items-center space-x-1.5">
    {icon}
    <div className="flex items-center space-x-1">
      <a href={url} className="font-bold" target="_blank" rel="noreferrer">
        {name}
      </a>
      <ExternalLinkIcon className="h-3 w-3" />
    </div>
  </div>
)

const StaffToolsDashboard: React.FC = () => {
  const { data, loading, error } = useQuery<GetStaffStatsQuery>(
    GET_STAFF_STATS_QUERY
  )
  const stats = data?.stats

  if (loading) return <PageLoading message="Loading dashboard" />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <ErrorMessage title="Failed to stats" error={error} />
            <div className="text-xl font-bold mb-1.5">Platform Stats</div>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <Stat
                icon={<UserIcon className="h-4 w-4" />}
                count={stats?.users as number}
                name="Users"
              />
              <Stat
                icon={<CubeIcon className="h-4 w-4" />}
                count={stats?.products as number}
                name="Products"
              />
              <Stat
                icon={<UsersIcon className="h-4 w-4" />}
                count={stats?.communities as number}
                name="Communities"
              />
              <Stat
                icon={<CollectionIcon className="h-4 w-4" />}
                count={stats?.posts as number}
                name="Posts"
              />
              <Stat
                icon={<HeartIcon className="h-4 w-4" />}
                count={stats?.likes as number}
                name="Likes"
              />
              <Stat
                icon={<HashtagIcon className="h-4 w-4" />}
                count={stats?.topics as number}
                name="Topics"
              />
              <Stat
                icon={<IdentificationIcon className="h-4 w-4" />}
                count={stats?.badges as number}
                name="Badges"
              />
              <Stat
                icon={<BellIcon className="h-4 w-4" />}
                count={stats?.notifications as number}
                name="Notifications"
              />
              <Stat
                icon={<LoginIcon className="h-4 w-4" />}
                count={stats?.sessions as number}
                name="Sessions"
              />
              <Stat
                icon={<ShieldExclamationIcon className="h-4 w-4" />}
                count={stats?.reports as number}
                name="Reports"
              />
            </div>
            <div className="border-b dark:border-gray-800 my-3" />
            <div className="text-xl font-bold mb-1.5">Services</div>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <Service
                icon={<ServerIcon className="h-4 w-4" />}
                url="https://vercel.com/devparty/devparty?utm_source=Devparty&utm_campaign=oss"
                name="Vercel"
              />
              <Service
                icon={<DatabaseIcon className="h-4 w-4" />}
                url="https://app.planetscale.com/yo/devparty"
                name="PlanetScale"
              />
              <Service
                icon={<ChipIcon className="h-4 w-4" />}
                url="https://console.upstash.com/redis/21cb559e-de14-44b9-a67f-05c67f2c8376"
                name="Upstash"
              />
              <Service
                icon={<GlobeIcon className="h-4 w-4" />}
                url="https://graphcdn.io/dashboard/yogi"
                name="GraphCDN"
              />
            </div>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default StaffToolsDashboard

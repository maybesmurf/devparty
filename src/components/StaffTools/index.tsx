import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { GetStaffStatsQuery } from '@graphql/types.generated'
import {
  BellIcon,
  ChipIcon,
  CollectionIcon,
  CubeIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  HashtagIcon,
  HeartIcon,
  IdentificationIcon,
  LoginIcon,
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
              <div className="flex items-center space-x-1.5">
                <UserIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.users}</span> Users
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <CubeIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.products}</span> Products
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <UsersIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.communities}</span>{' '}
                  Communities
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <CollectionIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.posts}</span> Posts
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <HeartIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.likes}</span> Likes
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <HashtagIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.topics}</span> Topics
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <IdentificationIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.badges}</span> Badges
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <BellIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.notifications}</span>{' '}
                  Notifications
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <LoginIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.sessions}</span> Sessions
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <ShieldExclamationIcon className="h-4 w-4" />
                <div>
                  <span className="font-bold">{stats?.reports}</span> Reports
                </div>
              </div>
            </div>
            <div className="border-b dark:border-gray-800 my-3" />
            <div className="text-xl font-bold mb-1.5">Services</div>
            <div className="text-gray-700 dark:text-gray-300 space-y-1">
              <div className="flex items-center space-x-1.5">
                <DatabaseIcon className="h-4 w-4" />
                <div className="flex items-center space-x-1">
                  <a
                    href="https://app.planetscale.com/yo/devparty"
                    className="font-bold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    PlanetScale
                  </a>
                  <ExternalLinkIcon className="h-3 w-3" />
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <ChipIcon className="h-4 w-4" />
                <div className="flex items-center space-x-1">
                  <a
                    href="https://console.upstash.com/redis/21cb559e-de14-44b9-a67f-05c67f2c8376"
                    className="font-bold"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Upstash
                  </a>
                  <ExternalLinkIcon className="h-3 w-3" />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default StaffToolsDashboard

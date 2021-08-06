import { gql, useQuery } from '@apollo/client'
import React from 'react'

import { User } from '~/__generated__/schema.generated'
import UserProfileLargeShimmer from '~/components/shared/Shimmer/UserProfileLargeShimmer'

import UserProfileLarge from '../shared/UserProfileLarge'
import { Card, CardBody } from '../ui/Card'
import { ErrorMessage } from '../ui/ErrorMessage'
import { RecentUsersQuery } from './__generated__/RecentUsers.generated'
import { CubeIcon, UsersIcon } from '@heroicons/react/outline'
import ProductProfileLargeShimmer from '../shared/Shimmer/ProductProfileLargeShimmer'

export const query = gql`
  query RecentUsersQuery {
    users(take: 5) {
      id
      username
      profile {
        name
      }
    }
  }
`

const RecentUsersCard = ({ children }: any) => {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <CubeIcon className="h-4 w-4" />
        <div>Recent products</div>
      </div>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  )
}

const RecentProducts: React.FC = () => {
  const { data, loading, error } = useQuery<RecentUsersQuery>(query)

  if (loading)
    return (
      <RecentUsersCard>
        <div className="space-y-3">
          <ProductProfileLargeShimmer />
          <ProductProfileLargeShimmer />
          <ProductProfileLargeShimmer />
          <ProductProfileLargeShimmer />
          <ProductProfileLargeShimmer />
        </div>
      </RecentUsersCard>
    )

  return (
    <RecentUsersCard>
      <ErrorMessage title="Failed to load posts" error={error} />
      <div className="space-y-3">🚧 WIP</div>
    </RecentUsersCard>
  )
}

export default RecentProducts

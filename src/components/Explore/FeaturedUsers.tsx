import { gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { GetFeaturedUsersQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { SparklesIcon } from '@heroicons/react/solid'
import React from 'react'

const GET_FEATURED_USERS_QUERY = gql`
  query GetFeaturedUsers {
    featuredUsers {
      edges {
        node {
          id
          username
          hasFollowed
          isVerified
          profile {
            id
            avatar
            name
          }
          status {
            emoji
            text
          }
        }
      }
    }
  }
`

const FeaturedUsersCard: React.FC = ({ children }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 lg:mb-2 px-3 lg:px-0">
        <SparklesIcon className="h-4 w-4 text-yellow-500" />
        <div>Featured users</div>
      </div>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  )
}

const FeaturedUsers: React.FC = () => {
  const { data, loading, error } = useQuery<GetFeaturedUsersQuery>(
    GET_FEATURED_USERS_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )
  const users = data?.featuredUsers?.edges?.map((edge) => edge?.node)

  if (loading)
    return (
      <FeaturedUsersCard>
        <div className="space-y-4">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </div>
      </FeaturedUsersCard>
    )

  return (
    <FeaturedUsersCard>
      <ErrorMessage title="Failed to load users" error={error} />
      <div className="space-y-3">
        {users?.length === 0 && (
          <EmptyState
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
            message="No users are featured"
            hideCard
          />
        )}
        {users?.map((user) => (
          <UserProfile key={user?.id} user={user as User} showFollow />
        ))}
      </div>
    </FeaturedUsersCard>
  )
}

export default FeaturedUsers

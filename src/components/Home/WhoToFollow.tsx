import { ApolloQueryResult, gql, useQuery } from '@apollo/client'
import UserProfileShimmer from '@components/shared/Shimmer/UserProfileShimmer'
import UserProfile from '@components/shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { GetWhoToFollowQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { RefreshIcon, SparklesIcon } from '@heroicons/react/solid'
import React from 'react'

const GET_WHO_TO_FOLLOW_QUERY = gql`
  query GetWhoToFollow {
    whoToFollow {
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

interface Props {
  children: React.ReactNode
  refetch?: () => Promise<ApolloQueryResult<any>>
}

const WhoToFollowCard: React.FC<Props> = ({ children, refetch }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-3 lg:mb-2 px-3 lg:px-0">
        <div className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4 text-yellow-500" />
          <div>Who to follow</div>
        </div>
        <button onClick={() => refetch && refetch()}>
          <RefreshIcon className="h-5 w-5" />
        </button>
      </div>
      <Card>
        <CardBody>{children}</CardBody>
      </Card>
    </div>
  )
}

const WhoToFollow: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<GetWhoToFollowQuery>(
    GET_WHO_TO_FOLLOW_QUERY,
    {
      notifyOnNetworkStatusChange: true
    }
  )
  const users = data?.whoToFollow?.edges?.map((edge) => edge?.node)

  if (loading)
    return (
      <WhoToFollowCard>
        <div className="space-y-4">
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
          <UserProfileShimmer showFollow />
        </div>
      </WhoToFollowCard>
    )

  return (
    <WhoToFollowCard refetch={refetch}>
      <ErrorMessage title="Failed to load users" error={error} />
      <div className="space-y-3">
        {users?.length === 0 && (
          <EmptyState
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
            message="Nothing to suggest"
            hideCard
          />
        )}
        {users?.map((user) => (
          <UserProfile key={user?.id} user={user as User} showFollow />
        ))}
      </div>
    </WhoToFollowCard>
  )
}

export default WhoToFollow

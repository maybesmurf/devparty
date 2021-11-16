import { gql, useQuery } from '@apollo/client'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfile from '@components/shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetFollowersQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/utilities'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'

export const GET_FOLLOWERS_QUERY = gql`
  query GetFollowers($after: String, $username: String!) {
    user(username: $username) {
      followers(first: 10, after: $after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            username
            isVerified
            isFollowing
            hasFollowed
            profile {
              id
              name
              avatar
              bio
            }
            status {
              emoji
              text
            }
          }
        }
      }
    }
  }
`

const FollowersList: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<GetFollowersQuery>(
    GET_FOLLOWERS_QUERY,
    {
      variables: {
        after: null,
        username: router.query.username
      },
      skip: !router.isReady
    }
  )
  const followers = data?.user?.followers?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.followers?.pageInfo

  const { observe } = useInView({
    threshold: 1,
    onChange: ({ observe, unobserve }) => {
      unobserve()
      observe()
    },
    onEnter: () => {
      if (pageInfo?.hasNextPage) {
        fetchMore({
          variables: {
            after: pageInfo?.endCursor ? pageInfo?.endCursor : null
          }
        })
      }
    }
  })

  if (loading)
    return (
      <div className="space-y-3">
        <Card>
          <CardBody>
            <UserProfileLargeShimmer showFollow />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <UserProfileLargeShimmer showFollow />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <UserProfileLargeShimmer showFollow />
          </CardBody>
        </Card>
      </div>
    )

  return (
    <div>
      <ErrorMessage title="Failed to load followers" error={error} />
      <div className="space-y-3">
        {followers?.length === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">
                  @{formatUsername(router.query.username as string)}
                </span>
                <span>doesn’t have any followers yet.</span>
              </div>
            }
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          followers?.map((user) => (
            <Card key={user?.id}>
              <CardBody>
                <UserProfile user={user as User} showFollow />
              </CardBody>
            </Card>
          ))
        )}
        {pageInfo?.hasNextPage && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default FollowersList

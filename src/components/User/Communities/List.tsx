import { gql, useQuery } from '@apollo/client'
import CommunityProfileLarge from '@components/shared/CommunityProfileLarge'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Community, GetAllUserCommunitiesQuery } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/utilities'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'

export const GET_ALL_USER_COMMUNITIES_QUERY = gql`
  query GetAllUserCommunities($after: String, $username: String!) {
    user(username: $username) {
      communities(first: 10, after: $after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            slug
            name
            description
            avatar
            hasJoined
          }
        }
      }
    }
  }
`

const CommunitiesList: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } =
    useQuery<GetAllUserCommunitiesQuery>(GET_ALL_USER_COMMUNITIES_QUERY, {
      variables: {
        after: null,
        username: router.query.username
      },
      skip: !router.isReady
    })
  const communities = data?.user?.communities?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.communities?.pageInfo

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
        {communities?.length === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">
                  @{formatUsername(router.query.username as string)}
                </span>
                <span>doesn’t have any communities yet.</span>
              </div>
            }
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          communities?.map((community) => (
            <Card key={community?.id}>
              <CardBody>
                <CommunityProfileLarge
                  community={community as Community}
                  showJoin
                />
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

export default CommunitiesList

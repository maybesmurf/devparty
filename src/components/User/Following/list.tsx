import { gql, useQuery } from '@apollo/client'
import { UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'

import UserProfileLargeShimmer from '~/components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfileLarge from '~/components/shared/UserProfileLarge'
import { ErrorMessage } from '~/components/ui/ErrorMessage'

import { Card, CardBody } from '../../ui/Card'
import { EmptyState } from '../../ui/EmptyState'
import { FollowingQuery } from './__generated__/list.generated'

export const FOLLOWING_QUERY = gql`
  query FollowingQuery($after: String, $username: String!) {
    user(username: $username) {
      following(first: 10, after: $after) {
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
            hasFollowed
            profile {
              id
              name
              avatar
              bio
            }
          }
        }
      }
    }
  }
`

const FollowingList: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<FollowingQuery>(
    FOLLOWING_QUERY,
    {
      variables: {
        after: null,
        username: router.query.username
      },
      skip: !router.isReady
    }
  )
  const following = data?.user?.following?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.following?.pageInfo

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
      <ErrorMessage title="Failed to load posts" error={error} />
      <div className="space-y-3">
        {following?.length === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">@{router.query.username}</span>
                <span>isn’t following anybody.</span>
              </div>
            }
            icon={<UsersIcon className="h-8 w-8" />}
          />
        ) : (
          following?.map((user: any) => (
            <Card key={user?.id}>
              <CardBody>
                <UserProfileLarge user={user} showFollow />
              </CardBody>
            </Card>
          ))
        )}
        {pageInfo?.hasNextPage && <span ref={observe}></span>}
      </div>
    </div>
  )
}

export default FollowingList

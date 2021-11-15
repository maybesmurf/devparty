import { gql, useQuery } from '@apollo/client'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { MembersQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'

export const MEMBERS_QUERY = gql`
  query Members($after: String, $slug: String!) {
    community(slug: $slug) {
      members(first: 10, after: $after) {
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

const MembersList: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<MembersQuery>(
    MEMBERS_QUERY,
    {
      variables: {
        after: null,
        slug: router.query.slug
      },
      skip: !router.isReady
    }
  )
  const members = data?.community?.members?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.community?.members?.pageInfo

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
      <ErrorMessage title="Failed to load members" error={error} />
      <div className="space-y-3">
        {members?.length === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">{router.query.slug}</span>
                <span>doesn’t have any members yet.</span>
              </div>
            }
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          members?.map((user) => (
            <Card key={user?.id}>
              <CardBody>
                <UserProfileLarge user={user as User} showFollow />
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

export default MembersList

import { gql, useMutation, useQuery } from '@apollo/client'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  MembersQuery,
  RemoveCommunityUserMutation,
  RemoveCommunityUserMutationVariables,
  User
} from '@graphql/types.generated'
import { UserRemoveIcon, UsersIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'
import toast from 'react-hot-toast'

export const MEMBERS_QUERY = gql`
  query Members($after: String, $slug: String!) {
    community(slug: $slug) {
      id
      owner {
        id
      }
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
  const { currentUser } = useContext(AppContext)
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
  const [removeCommunityUser] = useMutation<
    RemoveCommunityUserMutation,
    RemoveCommunityUserMutationVariables
  >(
    gql`
      mutation RemoveCommunityUser($input: RemoveCommunityUserInput!) {
        removeCommunityUser(input: $input)
      }
    `,
    {
      refetchQueries: [
        { query: MEMBERS_QUERY, variables: { slug: router.query.slug } }
      ],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success('User has been removed successfully')
      }
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

  const renderAction = (userId: string) => {
    return (
      currentUser?.id === data?.community?.owner?.id && (
        <Button
          variant="danger"
          size="sm"
          outline
          icon={<UserRemoveIcon className="h-4 w-4" />}
          onClick={() =>
            removeCommunityUser({
              variables: {
                input: { userId, communityId: data?.community?.id as string }
              }
            })
          }
        >
          Remove
        </Button>
      )
    )
  }

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
                <UserProfileLarge
                  action={renderAction(user?.id as string)}
                  user={user as User}
                  showFollow
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

export default MembersList

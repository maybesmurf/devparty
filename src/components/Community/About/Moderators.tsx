import { gql, useMutation, useQuery } from '@apollo/client'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import AppContext from '@components/utils/AppContext'
import {
  GetModeratorsQuery,
  RemoveCommunityModeratorMutation,
  RemoveCommunityModeratorMutationVariables,
  User
} from '@graphql/types.generated'
import { UserRemoveIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'

export const GET_MODERATORS_QUERY = gql`
  query GetModerators($after: String, $slug: String!) {
    community(slug: $slug) {
      id
      owner {
        id
      }
      moderators(first: 10, after: $after) {
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

const ModeratorsList: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading, error } = useQuery<GetModeratorsQuery>(
    GET_MODERATORS_QUERY,
    {
      variables: {
        after: null,
        slug: router.query.slug
      },
      skip: !router.isReady
    }
  )
  const [removeCommunityModerator] = useMutation<
    RemoveCommunityModeratorMutation,
    RemoveCommunityModeratorMutationVariables
  >(
    gql`
      mutation RemoveCommunityModerator(
        $input: RemoveCommunityModeratorInput!
      ) {
        removeCommunityModerator(input: $input)
      }
    `,
    {
      refetchQueries: [
        { query: GET_MODERATORS_QUERY, variables: { slug: router.query.slug } }
      ],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success('Moderator has been removed successfully')
      }
    }
  )
  const moderators = data?.community?.moderators?.edges?.map(
    (edge) => edge?.node
  )

  if (loading)
    return (
      <div className="space-y-5 py-5">
        <UserProfileLargeShimmer showFollow />
        <UserProfileLargeShimmer showFollow />
        <UserProfileLargeShimmer showFollow />
      </div>
    )

  const renderAction = (userId: string) => {
    return (
      currentUser?.id === data?.community?.owner?.id && (
        <Button
          variant="danger"
          size="sm"
          outline
          icon={<UserRemoveIcon className="h-4 w-4" />}
          onClick={() =>
            removeCommunityModerator({
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

  return (
    <div className="space-y-5 py-5">
      <ErrorMessage title="Failed to load moderators" error={error} />
      {moderators?.map((user) => (
        <div key={user?.id}>
          <UserProfileLarge
            action={renderAction(user?.id as string)}
            user={user as User}
            showFollow
          />
        </div>
      ))}
    </div>
  )
}

export default ModeratorsList

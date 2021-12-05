import { gql, useQuery } from '@apollo/client'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetFollowingQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { useRouter } from 'next/router'
import useInView from 'react-cool-inview'

const GET_FOLLOWING_QUERY = gql`
  query GetFollowing($after: String, $username: String!) {
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

const Following: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<GetFollowingQuery>(
    GET_FOLLOWING_QUERY,
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
      <div className="p-5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading following</div>
      </div>
    )

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage title="Failed to load following" error={error} />
      <div className="space-y-3">
        {following?.length === 0 ? (
          <div className="p-5">
            <EmptyState
              message={
                <div>
                  <span className="font-bold mr-1">
                    @{formatUsername(router.query.username as string)}
                  </span>
                  <span>isn’t following anybody.</span>
                </div>
              }
              icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
              hideCard
            />
          </div>
        ) : (
          <div className="divide-y">
            {following?.map((user) => (
              <div className="p-5" key={user?.id}>
                <UserProfileLarge user={user as User} showFollow />
              </div>
            ))}
          </div>
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

export default Following

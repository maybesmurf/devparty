import { gql, useQuery } from '@apollo/client'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetTippingsQuery, User } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { useRouter } from 'next/router'
import useInView from 'react-cool-inview'

const GET_TIPPINGS_QUERY = gql`
  query GetTippings($after: String, $username: String!) {
    user(username: $username) {
      receivedTips(first: 10, after: $after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            dispatcher {
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
  }
`

const AllTippings: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<GetTippingsQuery>(
    GET_TIPPINGS_QUERY,
    {
      variables: { after: null, username: router.query.username },
      skip: !router.isReady
    }
  )
  const tippings = data?.user?.receivedTips?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.receivedTips?.pageInfo

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
        <div>Loading tippers</div>
      </div>
    )

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <ErrorMessage title="Failed to load followers" error={error} />
      <div className="space-y-3">
        {tippings?.length === 0 ? (
          <div className="p-5">
            <EmptyState
              message={
                <div>
                  <span className="font-bold mr-1">
                    @{formatUsername(router.query.username as string)}
                  </span>
                  <span>doesn’t have any tips yet.</span>
                </div>
              }
              icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
              hideCard
            />
          </div>
        ) : (
          <div className="divide-y">
            {tippings?.map((tip) => (
              <div className="p-5" key={tip?.id}>
                <UserProfileLarge user={tip?.dispatcher as User} showFollow />
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

export default AllTippings

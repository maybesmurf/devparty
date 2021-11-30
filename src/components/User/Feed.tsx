import { gql, useQuery } from '@apollo/client'
import SinglePost, { PostFragment } from '@components/Post/SinglePost'
import PostsShimmer from '@components/shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetUserFeedQuery, Post } from '@graphql/types.generated'
import { CollectionIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'
import { POLLING_INTERVAL } from 'src/constants'

const GET_USER_FEED_QUERY = gql`
  query GetUserFeed($after: String, $username: String!) {
    user(username: $username) {
      id
      posts(first: 10, after: $after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            ...PostFragment
          }
        }
      }
    }
  }
  ${PostFragment}
`

const UserFeed: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<GetUserFeedQuery>(
    GET_USER_FEED_QUERY,
    {
      variables: {
        after: null,
        username: router.query.username
      },
      skip: !router.isReady,
      pollInterval: POLLING_INTERVAL
    }
  )

  const posts = data?.user?.posts?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.posts?.pageInfo

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

  if (loading) return <PostsShimmer />

  return (
    <>
      <ErrorMessage title="Failed to load posts" error={error} />
      <div className="space-y-3">
        {data?.user?.posts?.totalCount === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">
                  @{formatUsername(router.query.username as string)}
                </span>
                <span>seems like not posted yet!</span>
              </div>
            }
            icon={<CollectionIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          posts?.map((post) => (
            <SinglePost key={post?.id} post={post as Post} showParent />
          ))
        )}
        {pageInfo?.hasNextPage && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </>
  )
}

export default UserFeed

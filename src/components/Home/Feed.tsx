import { gql, useQuery } from '@apollo/client'
import SinglePost, { PostFragment } from '@components/Post/SinglePost'
import PostsShimmer from '@components/shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetHomeFeedQuery, Post } from '@graphql/types.generated'
import { CollectionIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'
import { POLLING_INTERVAL } from 'src/constants'

export const GET_HOME_FEED_QUERY = gql`
  query GetHomeFeed($after: String, $type: String!) {
    posts: homeFeed(first: 10, after: $after, type: $type) {
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
  ${PostFragment}
`

interface Props {
  feedType?: string
}

const HomeFeed: React.FC<Props> = ({ feedType }) => {
  const { data, loading, error, fetchMore } = useQuery<GetHomeFeedQuery>(
    GET_HOME_FEED_QUERY,
    {
      variables: { after: null, type: feedType },
      pollInterval: POLLING_INTERVAL
    }
  )
  const posts = data?.posts?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.posts?.pageInfo

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
    <div>
      <ErrorMessage title="Failed to load posts" error={error} />
      <div className="space-y-3">
        {posts?.length === 0 ? (
          <EmptyState
            message="No posts found, follow some users!"
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
    </div>
  )
}

export default HomeFeed

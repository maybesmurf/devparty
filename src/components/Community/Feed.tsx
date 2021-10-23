import { gql, useQuery } from '@apollo/client'
import SinglePost, { PostFragment } from '@components/Post/SinglePost'
import PostsShimmer from '@components/shared/Shimmer/PostsShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { CollectionIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'
import { Community } from 'src/__generated__/schema.generated'
import { POLLING_INTERVAL } from 'src/constants'

import { CommunityFeedQuery } from './__generated__/Feed.generated'

const COMMUNITY_FEED_QUERY = gql`
  query CommunityFeedQuery($after: String, $slug: String!) {
    community(slug: $slug) {
      id
      posts(first: 10, after: $after) {
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

interface Props {
  community: Community
}

const CommunityFeed: React.FC<Props> = ({ community }) => {
  const { data, loading, error, fetchMore } = useQuery<CommunityFeedQuery>(
    COMMUNITY_FEED_QUERY,
    {
      variables: {
        after: null,
        slug: community?.slug
      },
      skip: !community?.slug,
      pollInterval: POLLING_INTERVAL
    }
  )

  const posts = data?.community?.posts?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.community?.posts?.pageInfo

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
            message={
              <div>
                <span>No posts found in</span>
                <span className="font-bold ml-1">{community?.name}</span>
              </div>
            }
            icon={<CollectionIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          posts?.map((post: any) => (
            <SinglePost key={post?.id} post={post} showParent />
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

export default CommunityFeed

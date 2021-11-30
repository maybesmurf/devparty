import { gql, useQuery } from '@apollo/client'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { GetMorePostsByUserQuery, Post } from '@graphql/types.generated'
import { CollectionIcon } from '@heroicons/react/outline'
import { imagekitURL } from '@lib/imagekitURL'
import Link from 'next/link'
import React from 'react'

export const GET_MORE_POSTS_BY_USER_QUERY = gql`
  query GetMorePostsByUser($userId: ID!, $type: String!) {
    morePostsByUser(userId: $userId, type: $type) {
      edges {
        node {
          id
          title
          user {
            id
            username
            profile {
              id
              name
              avatar
            }
          }
        }
      }
    }
  }
`

interface Props {
  post: Post
}
const MorePostsCard = ({
  title,
  children
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center gap-2">
        <CollectionIcon className="h-4 w-4" />
        <div>More by {title}</div>
      </div>
      <Card>
        <CardBody className="space-y-5">{children}</CardBody>
      </Card>
    </div>
  )
}

const MorePosts: React.FC<Props> = ({ post }) => {
  const { data, error } = useQuery<GetMorePostsByUserQuery>(
    GET_MORE_POSTS_BY_USER_QUERY,
    {
      variables: {
        userId: post?.user?.id,
        type: 'QUESTION'
      },
      skip: !post?.user?.id
    }
  )
  const posts = data?.morePostsByUser?.edges?.map((edge) => edge?.node)

  return (
    <MorePostsCard title={post?.user?.profile?.name}>
      <ErrorMessage title="Failed to load more posts" error={error} />
      {Array.isArray(posts) &&
        posts?.length > 0 &&
        posts?.map((post) => (
          <div key={post?.id} className="space-y-2">
            <div>{post?.title}</div>
            <div className="flex items-center space-x-1 text-sm">
              <img
                className="h-5 w-5 rounded-full"
                src={imagekitURL(post?.user?.profile?.avatar as string, 50, 50)}
                alt={`@${post?.user?.profile?.avatar}'`}
              />
              <Link href={`/u/${post?.user?.username}`} passHref>
                <a href={`/u/${post?.user?.username}`}>
                  {post?.user?.profile?.name}
                </a>
              </Link>
            </div>
          </div>
        ))}
    </MorePostsCard>
  )
}

export default MorePosts

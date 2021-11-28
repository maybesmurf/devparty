import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Footer from '@components/shared/Footer'
import DevpartySEO from '@components/shared/SEO'
import PostShimmer from '@components/shared/Shimmer/PostShimmer'
import UserProfileShimmer from '@components/shared/Shimmer/UserProfileShimmer'
import UserCard from '@components/shared/UserCard'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import AppContext from '@components/utils/AppContext'
import { GetPostQuery, Post, User } from '@graphql/types.generated'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import Metadata from './Metadata'
import MorePosts from './MorePosts'
import NewReply from './Reply/NewReply'
import Replies from './Reply/Replies'
import SinglePost, { PostFragment } from './SinglePost'

const PostMod = dynamic(() => import('./Mod'))

export const GET_POST_QUERY = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostFragment
    }
  }
  ${PostFragment}
`

const ViewPost: React.FC = () => {
  const router = useRouter()
  const { currentUser, staffMode } = useContext(AppContext)
  const { data, loading, error } = useQuery<GetPostQuery>(GET_POST_QUERY, {
    variables: { id: router.query.postId },
    skip: !router.isReady
  })
  const post = data?.post

  if (!router.isReady || loading)
    return (
      <GridLayout>
        <GridItemEight>
          <PostShimmer />
        </GridItemEight>
        <GridItemFour>
          <Card className="mb-5">
            <CardBody>
              <UserProfileShimmer showFollow />
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex justify-between">
              <div className="shimmer rounded h-4 w-28" />
              <div className="shimmer rounded h-4 w-16" />
            </CardBody>
          </Card>
        </GridItemFour>
      </GridLayout>
    )

  if (!post) return <Custom404 />

  return (
    <GridLayout>
      <DevpartySEO
        title={`${post?.user?.profile?.name} on Devparty: ${
          post?.title ? post?.title : post?.body.slice(0, 255)
        }`}
        description={post?.body.slice(0, 255) as string}
        image={post?.user?.profile?.avatar as string}
        path={`/posts/${post?.id}`}
      />
      <GridItemEight>
        <div className="space-y-5">
          <ErrorMessage title="Failed to load post" error={error} />
          <SinglePost post={post as Post} showParent showMint />
          {currentUser && !loading && <NewReply post={post as Post} />}
          <Replies post={post as Post} />
        </div>
      </GridItemEight>
      <GridItemFour>
        <div className="space-y-5">
          <UserCard user={post?.user as User} />
          {currentUser?.isStaff && staffMode && <PostMod post={post as Post} />}
          <Metadata ipfsHash={post?.ipfsHash as string} />
          {post?.type === 'QUESTION' && <MorePosts post={post as Post} />}
          <Footer />
        </div>
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewPost

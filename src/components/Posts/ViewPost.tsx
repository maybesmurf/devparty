import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import { Post, User } from '~/__generated__/schema.generated'
import {
  GridItemEight,
  GridItemFour,
  GridLayout
} from '~/components/GridLayout'
import SinglePost, { PostFragment } from '~/components/Posts/SinglePost'
import UserProfileLarge from '~/components/shared/UserProfileLarge'
import { Card, CardBody } from '~/components/ui/Card'
import { ErrorMessage } from '~/components/ui/ErrorMessage'

import PostShimmer from '../shared/Shimmer/PostShimmer'
import UserProfileLargeShimmer from '../shared/Shimmer/UserProfileLargeShimmer'
import { PostQuery } from './__generated__/ViewPost.generated'

const query = gql`
  query PostQuery($id: ID!) {
    post(id: $id) {
      ...PostFragment
    }
  }
  ${PostFragment}
`

const ViewPost: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<PostQuery>(query, {
    variables: {
      id: router.query.postId
    },
    skip: !router.isReady
  })

  return (
    <Fragment>
      <GridLayout>
        <GridItemEight>
          <ErrorMessage title="Failed to load post" error={error} />
          {loading ? <PostShimmer /> : <SinglePost post={data?.post as Post} />}
        </GridItemEight>
        <GridItemFour>
          <Card>
            <CardBody>
              {loading ? (
                <UserProfileLargeShimmer showFollow />
              ) : (
                <UserProfileLarge user={data?.post?.user as User} showFollow />
              )}
            </CardBody>
          </Card>
        </GridItemFour>
      </GridLayout>
    </Fragment>
  )
}

export default ViewPost

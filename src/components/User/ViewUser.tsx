import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { PageLoading } from '@components/ui/PageLoading'
import { imagekitURL } from '@components/utils/imagekitURL'
import { useRouter } from 'next/router'
import React from 'react'
import { User } from 'src/__generated__/schema.generated'
import Custom404 from 'src/pages/404'

import { ViewUserQuery } from './__generated__/ViewUser.generated'
import Details from './Details'
import UserFeed from './Feed'

export const UserFragment = gql`
  fragment UserFragment on User {
    id
    username
    hasFollowed
    isFollowing
    hasWakatimeIntegration
    hasSpotifyIntegration
    isVerified
    isStaff
    spammy
    createdAt
    featuredAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    posts {
      totalCount
    }
    profile {
      id
      avatar
      nftSource
      cover
      coverBg
      name
      bio
      location
      website
      twitter
      github
      discord
    }
    tip {
      id
    }
  }
`

export const VIEW_USER_QUERY = gql`
  query ViewUserQuery($username: String!) {
    user(username: $username) {
      ...UserFragment
    }
  }
  ${UserFragment}
`

const ViewUser: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<ViewUserQuery>(VIEW_USER_QUERY, {
    variables: {
      username: router.query.username
    },
    skip: !router.isReady
  })
  const user = data?.user

  if (!router.isReady || loading) return <PageLoading message="Loading user" />

  if (!user) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${user?.username} (${user?.profile?.name}) · Devparty`}
        description={user?.profile?.bio as string}
        image={user?.profile?.avatar as string}
        path={`/u/${user?.username}`}
      />
      <div
        className="h-64"
        style={{
          backgroundImage: `url(${imagekitURL(
            user?.profile?.cover as string
          )})`,
          backgroundColor: `#${user?.profile?.coverBg}`,
          backgroundSize: '60%'
        }}
      />
      <GridLayout>
        <GridItemFour>
          <ErrorMessage title="Failed to load post" error={error} />
          <Details user={user as User} />
        </GridItemFour>
        <GridItemEight>
          <div className="space-y-3">
            <UserFeed />
          </div>
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default ViewUser

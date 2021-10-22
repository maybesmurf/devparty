import { useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { PageLoading } from '@components/ui/PageLoading'
import Details from '@components/User/Details'
import { imagekitURL } from '@components/utils/imagekitURL'
import { useRouter } from 'next/router'
import React from 'react'
import { User } from 'src/__generated__/schema.generated'
import Custom404 from 'src/pages/404'

import { ViewUserQuery } from '../__generated__/ViewUser.generated'
import { VIEW_USER_QUERY } from '../ViewUser'
import FollowersList from './List'

export const USER_FOLLOWERS_QUERY = VIEW_USER_QUERY

const Followers: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<ViewUserQuery>(
    USER_FOLLOWERS_QUERY,
    {
      variables: {
        username: router.query.username
      },
      skip: !router.isReady
    }
  )
  const user = data?.user

  if (!router.isReady || loading)
    return <PageLoading message="Loading followers" />

  if (!user) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${user?.username} (${user?.profile?.name}) / Followers · Devparty`}
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
          <FollowersList />
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Followers

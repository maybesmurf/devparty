import { useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import Details from '@components/User/Details'
import { GetUserQuery, User } from '@graphql/types.generated'
import { imagekitURL } from '@lib/imagekitURL'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import PageType from '../PageType'
import { GET_USER_QUERY } from '../ViewUser'
import CommunitiesList from './List'

const Communities: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<GetUserQuery>(GET_USER_QUERY, {
    variables: { username: router.query.username },
    skip: !router.isReady
  })
  const user = data?.user

  if (!router.isReady || loading)
    return <PageLoading message="Loading communities" />

  if (!user) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${user?.username} (${user?.profile?.name}) / Products · Devparty`}
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
        <GridItemEight className="space-y-5">
          <PageType user={user as User} />
          <CommunitiesList />
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Communities

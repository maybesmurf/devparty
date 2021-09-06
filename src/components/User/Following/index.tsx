import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import { User } from '~/__generated__/schema.generated'
import { ErrorMessage } from '~/components/ui/ErrorMessage'
import { PageLoading } from '~/components/ui/PageLoading'

import { GridItemEight, GridItemFour, GridLayout } from '../../GridLayout'
import { ViewUserQuery } from '../__generated__/ViewUser.generated'
import Details from '../Details'
import { VIEW_USER_QUERY } from '../ViewUser'
import FollowingList from './list'

export const USER_FOLLOWING_QUERY = VIEW_USER_QUERY

const Following: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<ViewUserQuery>(
    USER_FOLLOWING_QUERY,
    {
      variables: {
        username: router.query.username
      },
      skip: !router.isReady
    }
  )

  if (loading) return <PageLoading message="Loading following..." />

  return (
    <Fragment>
      {data?.user?.profile?.cover ? (
        <img
          className="object-cover bg-gradient-to-r from-blue-400 to-purple-400 h-60 w-full"
          src={data?.user?.profile?.cover as string}
          alt={`@${data?.user?.username}'s cover`}
        />
      ) : (
        <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-60 w-full" />
      )}
      <GridLayout>
        <GridItemFour>
          <ErrorMessage title="Failed to load post" error={error} />
          <Details user={data?.user as User} />
        </GridItemFour>
        <GridItemEight>
          <FollowingList />
        </GridItemEight>
      </GridLayout>
    </Fragment>
  )
}

export default Following

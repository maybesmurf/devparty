import { gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'

import { User } from '~/__generated__/schema.generated'

import { GridItemEight, GridItemFour, GridLayout } from '../GridLayout'
import DetailsShimmer from '../shared/Shimmer/DetailsShimmer'
import { ErrorMessage } from '../ui/ErrorMessage'
import { ProfileQuery } from './__generated__/index.generated'
import Details from './Details'
import UserFeed from './Feed'

export const PROFILE_QUERY = gql`
  query ProfileQuery($username: String!) {
    user(username: $username) {
      id
      username
      hasFollowed
      followersCount
      followingCount
      profile {
        id
        avatar
        name
        bio
        location
        website
        twitter
        github
        discord
      }
    }
  }
`

const Profile: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<ProfileQuery>(PROFILE_QUERY, {
    variables: {
      username: router.query.username
    },
    skip: !router.isReady
  })

  return (
    <Fragment>
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 h-60 w-full" />
      <GridLayout>
        <GridItemFour>
          <ErrorMessage title="Failed to load post" error={error} />
          {loading ? <DetailsShimmer /> : <Details user={data?.user as User} />}
        </GridItemFour>
        <GridItemEight>
          <UserFeed user={data?.user as User} />
        </GridItemEight>
      </GridLayout>
    </Fragment>
  )
}

export default Profile

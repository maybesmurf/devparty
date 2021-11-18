import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { GetProfileSettingsQuery, User } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import ProfileSettingsForm from './Form'

export const GET_PROFILE_SETTINGS_QUERY = gql`
  query GetProfileSettings {
    me {
      id
      username
      email
      profile {
        id
        name
        bio
        location
        avatar
        cover
        coverBg
      }
      status {
        emoji
        text
      }
      integrations {
        ethAddress
      }
    }
  }
`

const ProfileSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetProfileSettingsQuery>(
    GET_PROFILE_SETTINGS_QUERY
  )

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  return (
    <>
      <ProfileSettingsForm currentUser={data?.me as User} />
    </>
  )
}

export default ProfileSettings

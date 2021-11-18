import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { GetSocialQuery, User } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import SocialSettingsForm from './Form'

export const GET_SOCIAL_QUERY = gql`
  query GetSocial {
    me {
      id
      profile {
        id
        website
        twitter
        github
        discord
      }
    }
  }
`

const SocialSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetSocialQuery>(GET_SOCIAL_QUERY)

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  return <SocialSettingsForm currentUser={data?.me as User} />
}

export default SocialSettings

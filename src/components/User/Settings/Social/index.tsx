import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import { GetSocialQuery, User } from '@graphql/types.generated'
import React from 'react'

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
  const { data, loading } = useQuery<GetSocialQuery>(GET_SOCIAL_QUERY)

  if (loading) {
    return <PageLoading message="Loading settings" />
  }

  return <SocialSettingsForm currentUser={data?.me as User} />
}

export default SocialSettings

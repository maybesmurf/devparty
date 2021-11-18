import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import { GetTipsQuery, User } from '@graphql/types.generated'
import React from 'react'

import TipsSettingsForm from './Form'

export const GET_TIPS_QUERY = gql`
  query GetTips {
    me {
      id
      tip {
        id
        cash
        paypal
        github
        buymeacoffee
        bitcoin
        ethereum
        solana
      }
    }
  }
`

const TipsSettings: React.FC = () => {
  const { data, loading } = useQuery<GetTipsQuery>(GET_TIPS_QUERY)

  if (loading) {
    return <PageLoading message="Loading settings" />
  }

  return <TipsSettingsForm currentUser={data?.me as User} />
}

export default TipsSettings

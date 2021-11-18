import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { GetTipsQuery, User } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

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
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetTipsQuery>(GET_TIPS_QUERY)

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  return <TipsSettingsForm currentUser={data?.me as User} />
}

export default TipsSettings

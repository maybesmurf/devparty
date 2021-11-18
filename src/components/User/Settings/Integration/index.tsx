import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { GetIntegrationQuery, Integration } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import IntegrationSettingsForm from './Form'

export const GET_INTEGRATION_QUERY = gql`
  query GetIntegration {
    integration {
      id
      wakatimeAPIKey
      spotifyRefreshToken
      ethAddress
    }
  }
`

const IntegrationSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetIntegrationQuery>(GET_INTEGRATION_QUERY)

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  return (
    <IntegrationSettingsForm integration={data?.integration as Integration} />
  )
}

export default IntegrationSettings

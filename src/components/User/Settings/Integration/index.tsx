import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import { GetIntegrationQuery, Integration } from '@graphql/types.generated'
import React from 'react'

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
  const { data, loading } = useQuery<GetIntegrationQuery>(GET_INTEGRATION_QUERY)

  if (loading) {
    return <PageLoading message="Loading settings" />
  }

  return (
    <IntegrationSettingsForm integration={data?.integration as Integration} />
  )
}

export default IntegrationSettings

import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { GetTipTiersQuery } from '@graphql/types.generated'
import React from 'react'

export const GET_TIP_TIERS_QUERY = gql`
  query GetTipTiers {
    me {
      id
      tip {
        id
        tiers {
          edges {
            node {
              id
              amount
              description
            }
          }
        }
      }
    }
  }
`

const TierSettings: React.FC = () => {
  const { data, loading } = useQuery<GetTipTiersQuery>(GET_TIP_TIERS_QUERY)
  const tiers = data?.me?.tip?.tiers?.edges?.map((edge) => edge?.node)

  if (loading) {
    return (
      <div className="px-5 py-3.5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading tip tiers</div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-lg font-bold">Tiers</div>
    </div>
  )
}

export default TierSettings

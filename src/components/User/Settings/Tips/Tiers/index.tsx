import { gql, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { EmptyState } from '@components/UI/EmptyState'
import { Spinner } from '@components/UI/Spinner'
import { GetTipTiersQuery } from '@graphql/types.generated'
import { CashIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

import AddTier from './Add'

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
  const [showAddTierModal, setShowAddTierModal] = useState<boolean>(false)
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
      <div>
        {tiers?.length === 0 && (
          <EmptyState
            message={
              <div className="text-center">
                <span>You don't have any tiers!</span>
                <div className="mt-4">
                  <Button
                    onClick={() => setShowAddTierModal(!showAddTierModal)}
                  >
                    Add tier
                  </Button>
                </div>
              </div>
            }
            icon={<CashIcon className="h-10 w-10 text-brand-500" />}
            hideCard
          />
        )}
        {tiers?.map((tier) => (
          <div key={tier?.id}>{tier?.id}</div>
        ))}
        <AddTier
          showAddTierModal={showAddTierModal}
          setShowAddTierModal={setShowAddTierModal}
        />
      </div>
    </div>
  )
}

export default TierSettings

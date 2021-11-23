import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { GetTipTiersSettingsQuery } from '@graphql/types.generated'

export const GET_TIP_TIERS_SETTINGS_QUERY = gql`
  query GetTipTiersSettings {
    me {
      id
      tip {
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

const TierForm: React.FC = () => {
  const { data, loading } = useQuery<GetTipTiersSettingsQuery>(
    GET_TIP_TIERS_SETTINGS_QUERY
  )

  const tiers = data?.me?.tip?.tiers

  if (loading)
    return (
      <div className="px-5 py-3.5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading tip tiers</div>
      </div>
    )

  return <div className="px-5 py-3.5">Hello</div>
}

export default TierForm

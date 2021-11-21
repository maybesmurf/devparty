import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import { gql, useQuery } from '@apollo/client'
import { Card } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { Community, GetCommunityRulesQuery } from '@graphql/types.generated'
import { ScaleIcon } from '@heroicons/react/outline'

export const GET_COMMUNITY_RULES_QUERY = gql`
  query GetCommunityRules($slug: String!) {
    community(slug: $slug) {
      id
      rules {
        edges {
          node {
            id
            name
            description
          }
        }
      }
    }
  }
`

interface Props {
  community: Community
  showCardAndHeading?: boolean
}

const Rules: React.FC<Props> = ({ community, showCardAndHeading = true }) => {
  const { data, loading } = useQuery<GetCommunityRulesQuery>(
    GET_COMMUNITY_RULES_QUERY,
    {
      variables: { slug: community?.slug },
      skip: !community?.slug
    }
  )
  const rules = data?.community?.rules?.edges?.map((edge) => edge?.node)

  const RulesCard: React.FC = ({ children }) => {
    return (
      <Card
        className={`mb-4 ${showCardAndHeading ? '' : 'border-0 !shadow-none'}`}
      >
        {children}
      </Card>
    )
  }

  if (loading)
    return (
      <RulesCard>
        {showCardAndHeading && (
          <div className="text-lg p-5">
            <div className="shimmer h-6 w-3/6 rounded" />
          </div>
        )}
        <div className="divide-y">
          {[...Array(3)]?.map((item: any, index: number) => (
            <div className="px-5 py-3 flex space-x-3" key={index}>
              <div className="shimmer h-5 w-5 rounded" />
              <div className="space-y-3 w-full">
                <div className="shimmer h-5 w-3/5 rounded" />
                <div className="space-y-2">
                  <div className="shimmer h-3 w-full rounded" />
                  <div className="shimmer h-3 w-4/5 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </RulesCard>
    )

  return (
    <RulesCard>
      {showCardAndHeading && (
        <div className="text-lg font-bold px-5 pt-4 pb-2">
          {community?.name} Rules
        </div>
      )}
      <div className="divide-y">
        {(rules?.length as number) < 1 && (
          <div className="py-4">
            <EmptyState
              icon={<ScaleIcon className="h-8 w-8 text-brand-500" />}
              message="No rules for this community"
              hideCard
            />
          </div>
        )}
        {rules?.map((rule: any, index: number) => (
          <div
            className="px-5 py-3 flex items-baseline space-x-3"
            key={rule.id}
          >
            <div className="font-bold text-brand-500 text-xl">{index + 1}.</div>
            <div className="space-y-1">
              <div className="font-bold">{rule.name}</div>
              <div className="text-sm">{rule.description}</div>
            </div>
          </div>
        ))}
      </div>
    </RulesCard>
  )
}

export default Rules

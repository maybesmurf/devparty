import { gql, useQuery } from '@apollo/client'
import { Tooltip } from '@components/UI/Tooltip'
import { GetUserBadgesQuery, User } from '@graphql/types.generated'

export const GET_USER_BADGES_QUERY = gql`
  query GetUserBadges($username: String!) {
    user(username: $username) {
      id
      badges {
        edges {
          node {
            id
            name
            description
            image
          }
        }
      }
    }
  }
`

interface Props {
  user: User
}

const Badges: React.FC<Props> = ({ user }) => {
  const { data, loading } = useQuery<GetUserBadgesQuery>(
    GET_USER_BADGES_QUERY,
    {
      variables: { username: user?.username },
      skip: !user?.username
    }
  )

  const badges = data?.user?.badges?.edges?.map((edge) => edge?.node)

  if (loading) return null

  return (
    <div className="space-y-2">
      <div className="font-bold">Badges</div>
      <div className="flex flex-wrap gap-x-5 gap-y-5 w-3/4">
        {badges?.map((badge) => (
          <div key={badge?.id}>
            <Tooltip content={badge?.name as string}>
              <img className="h-16" src={badge?.image} alt={badge?.name} />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Badges

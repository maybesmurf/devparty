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

  const getRandomRotate = () => {
    const rotateVariants = ['rotate-3', 'rotate-6', '-rotate-3', '-rotate-6']

    return rotateVariants[Math.floor(Math.random() * rotateVariants.length)]
  }

  if (loading) return null

  return (
    <div className="space-y-2">
      <div className="font-bold">Badges</div>
      <div className="flex flex-wrap gap-6">
        {badges?.map((badge) => (
          <div key={badge?.id}>
            <Tooltip content={badge?.name as string}>
              <img
                className={`h-16 sm:h-20 transform ${getRandomRotate()}`}
                src={badge?.image}
                alt={badge?.name}
              />
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Badges

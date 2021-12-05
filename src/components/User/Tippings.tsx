import { gql, useQuery } from '@apollo/client'
import { Tooltip } from '@components/UI/Tooltip'
import { GetUserTippingsQuery, User } from '@graphql/types.generated'
import { imagekitURL } from '@lib/imagekitURL'
import Link from 'next/link'

export const GET_USER_TIPPINGS_QUERY = gql`
  query GetUserTippings($username: String!) {
    user(username: $username) {
      id
      receivedTips {
        edges {
          node {
            id
            dispatcher {
              id
              username
              profile {
                id
                name
                avatar
              }
            }
          }
        }
      }
    }
  }
`

interface Props {
  user: User
}

const Tippings: React.FC<Props> = ({ user }) => {
  const { data, loading } = useQuery<GetUserTippingsQuery>(
    GET_USER_TIPPINGS_QUERY,
    { variables: { username: user?.username } }
  )
  const tippings = data?.user?.receivedTips?.edges?.map((edge) => edge?.node)

  const User = ({ user }: { user: User }) => {
    return (
      <Tooltip content={user?.profile?.name}>
        <Link href={`/u/${user?.username}`} passHref>
          <a href={`/u/${user?.username}`}>
            <img
              className="h-9 w-9 rounded-full"
              src={imagekitURL(user?.profile?.avatar as string, 100, 100)}
              alt={`@${user?.username}`}
            />
          </a>
        </Link>
      </Tooltip>
    )
  }

  if (loading)
    return (
      <div className="space-y-2">
        <div className="font-bold">Tippings</div>
        <div className="flex flex-wrap gap-1.5 w-3/4">
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
        </div>
      </div>
    )

  return (
    <div className="space-y-2">
      {tippings?.length !== 0 && <div className="font-bold">Tippings</div>}
      <div className="flex flex-wrap gap-1.5 w-3/4">
        {tippings?.map((tip) => (
          <User user={tip?.dispatcher as User} key={user?.id} />
        ))}
      </div>
    </div>
  )
}

export default Tippings

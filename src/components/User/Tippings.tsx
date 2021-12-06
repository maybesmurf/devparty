import { gql, useQuery } from '@apollo/client'
import { Modal } from '@components/UI/Modal'
import { Tooltip } from '@components/UI/Tooltip'
import { GetUserTippingsQuery, User } from '@graphql/types.generated'
import { imagekitURL } from '@lib/imagekitURL'
import Link from 'next/link'
import { useState } from 'react'

import AllTippings from './AllTippings'

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
  const [showTippingsModal, setShowTippingsModal] = useState<boolean>(false)
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
          <div className="shimmer h-9 w-9 rounded-full" />
          <div className="shimmer h-9 w-9 rounded-full" />
          <div className="shimmer h-9 w-9 rounded-full" />
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
        <button
          className="rounded-full h-9 w-9 flex items-center justify-center text-sm bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          onClick={() => setShowTippingsModal(!showTippingsModal)}
        >
          +5
        </button>
      </div>
      <Modal
        title="All Tippings"
        size="md"
        show={showTippingsModal}
        onClose={() => setShowTippingsModal(!showTippingsModal)}
      >
        <AllTippings />
      </Modal>
    </div>
  )
}

export default Tippings

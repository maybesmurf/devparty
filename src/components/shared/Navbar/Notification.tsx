import { gql, useQuery } from '@apollo/client'
import { GetNotificationCountQuery } from '@graphql/types.generated'
import { LightningBoltIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { POLLING_INTERVAL } from 'src/constants'

const GET_NOTIFICATION_COUNT_QUERY = gql`
  query GetNotificationCount {
    me {
      id
      notificationsCount
    }
  }
`

const Notification: React.FC = () => {
  const { data } = useQuery<GetNotificationCountQuery>(
    GET_NOTIFICATION_COUNT_QUERY,
    { pollInterval: POLLING_INTERVAL }
  )

  return (
    <Link href="/notifications" passHref>
      <a className="flex items-start">
        <LightningBoltIcon className="h-6 w-6" />
        {(data?.me?.notificationsCount as number) > 0 && (
          <div className="h-2 w-2 rounded-full bg-red-500" />
        )}
      </a>
    </Link>
  )
}

export default Notification

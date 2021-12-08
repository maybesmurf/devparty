import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import {
  Notification,
  ReadNotificationMutation,
  ReadNotificationMutationVariables
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'

import { GET_NOTIFICATIONS_QUERY } from '.'

interface Props {
  notification: Notification
}

const MarkAsRead: React.FC<Props> = ({ notification }) => {
  const [readNotification, { loading: markingAsRead }] = useMutation<
    ReadNotificationMutation,
    ReadNotificationMutationVariables
  >(
    gql`
      mutation ReadNotification($input: ReadNotificationInput!) {
        readNotification(input: $input)
      }
    `,
    {
      refetchQueries: [GET_NOTIFICATIONS_QUERY, 'GetNotifications'],
      onCompleted() {
        toast.success('Notification marked as read!')
      }
    }
  )

  return (
    <button
      disabled={markingAsRead}
      onClick={() =>
        readNotification({ variables: { input: { id: notification?.id } } })
      }
    >
      <Tooltip content="Mark as read">
        {markingAsRead ? (
          <Spinner size="xs" className="ml-1" />
        ) : (
          <CheckCircleIcon className="h-5 w-5 text-brand-500" />
        )}
      </Tooltip>
    </button>
  )
}

export default MarkAsRead

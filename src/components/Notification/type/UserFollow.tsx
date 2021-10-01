import Slug from '@components/shared/Slug'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Card, CardBody } from '@components/ui/Card'
import { UserAddIcon } from '@heroicons/react/outline'
import React from 'react'
import { Notification } from 'src/__generated__/schema.generated'
import * as timeago from 'timeago.js'

import MarkAsRead from '../Read'

interface Props {
  notification: Notification
  followedVia?: 'INVITE'
}

const UserFollow: React.FC<Props> = ({ notification, followedVia }) => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-3">
              <UserAddIcon className="h-6 w-6 text-green-500" />
              <Slug slug={notification?.dispatcher?.username} prefix="@" />
            </div>
            {followedVia === 'INVITE' ? (
              <div>used your invite and automatically followed you 🎉</div>
            ) : (
              <div>followed you</div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm cursor-pointer">
              {timeago.format(notification?.createdAt)}
            </div>
            <MarkAsRead notification={notification} />
          </div>
        </div>
        <UserProfileLarge user={notification?.dispatcher} showFollow />
      </CardBody>
    </Card>
  )
}

export default UserFollow

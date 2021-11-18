import SinglePost from '@components/Post/SinglePost'
import Slug from '@components/shared/Slug'
import { Card, CardBody } from '@components/UI/Card'
import { formatUsername } from '@components/utils/formatUsername'
import { Notification, Post } from '@graphql/types.generated'
import { AtSymbolIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import * as timeago from 'timeago.js'

import MarkAsRead from '../Read'

interface Props {
  notification: Notification
}

const UserMention: React.FC<Props> = ({ notification }) => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center linkify space-x-1">
            <div className="flex items-center space-x-3">
              <AtSymbolIcon className="h-6 w-6 text-blue-500" />
              <Slug
                slug={formatUsername(notification?.dispatcher?.username)}
                prefix="@"
              />
            </div>
            <div>mentioned you in the</div>
            <Link href={`/posts/${notification?.post?.id}`} passHref>
              <a href={`/posts/${notification?.post?.id}`}>post</a>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm cursor-pointer">
              {timeago.format(notification?.createdAt)}
            </div>
            <MarkAsRead notification={notification} />
          </div>
        </div>
        <SinglePost post={notification?.post as Post} />
      </CardBody>
    </Card>
  )
}

export default UserMention

import SinglePost from '@components/Post/SinglePost'
import Slug from '@components/shared/Slug'
import { Card, CardBody } from '@components/UI/Card'
import { Notification, Post } from '@graphql/types.generated'
import { ReplyIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import Link from 'next/link'
import React from 'react'
import * as timeago from 'timeago.js'

import MarkAsRead from '../Read'

interface Props {
  notification: Notification
}

const PostReply: React.FC<Props> = ({ notification }) => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center linkify space-x-1">
            <div className="flex items-center space-x-3">
              <ReplyIcon className="h-6 w-6 text-purple-500" />
              <Slug
                slug={formatUsername(notification?.dispatcher?.username)}
                prefix="@"
              />
            </div>
            <div>replied to your</div>
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

export default PostReply

import Star from '@components/Topic/Star'
import { Topic } from '@graphql/types.generated'
import { CollectionIcon, StarIcon } from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import Link from 'next/link'
import React from 'react'

interface Props {
  topic: Topic
  showStar?: boolean
  showToast?: boolean
}

const TopicProfile: React.FC<Props> = ({
  topic,
  showStar = false,
  showToast = true
}) => {
  return (
    <div className="flex justify-between items-center space-x-5">
      <div className="space-y-2">
        <div>
          <div className="flex items-center space-x-1.5">
            <Link href={`/topics/${topic?.name}`} passHref>
              <a
                href={`/topics/${topic?.name}`}
                className="font-bold cursor-pointer flex items-center space-x-1"
              >
                <div>#{topic?.name}</div>
              </a>
            </Link>
          </div>
        </div>
        <div>{topic?.description}</div>
        <div className="text-xs text-gray-500 flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4" />
            <div>{humanize(topic?.starrers?.totalCount)} stars</div>
          </div>
          <div className="flex items-center space-x-1">
            <CollectionIcon className="h-4 w-4" />
            <div>{humanize(topic?.postsCount)} posts</div>
          </div>
        </div>
      </div>
      {showStar && showStar && (
        <Star topic={topic} showToast={showToast} showText />
      )}
    </div>
  )
}

export default TopicProfile

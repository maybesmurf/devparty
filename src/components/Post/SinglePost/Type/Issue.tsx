import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import { Tooltip } from '@components/UI/Tooltip'
import { getTextColor } from '@components/utils/getTextColor'
import { useIssue } from '@components/utils/hooks/useIssue'
import { humanize } from '@components/utils/humanize'
import { imagekitURL } from '@components/utils/imagekitURL'
import { Post } from '@graphql/types.generated'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  FlagIcon
} from '@heroicons/react/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/solid'
import Markdown from 'markdown-to-jsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

interface ReactionProps {
  emoji: string
  count: number
}

const Reacttion: React.FC<ReactionProps> = ({ emoji, count }) => {
  if (count < 1) return null

  return (
    <div className="bg-gray-100 rounded-full px-3 py-1 border flex items-center space-x-2 cursor-default">
      <div>{emoji}</div>
      <div>{humanize(count)}</div>
    </div>
  )
}

interface Props {
  post: Post
}

const IssueType: React.FC<Props> = ({ post }) => {
  const router = useRouter()
  const { issue, isLoading, isError } = useIssue(post?.body)

  if (isLoading) return <div>Loading Issue...</div>

  if (isError)
    return (
      <div className="text-red-500 font-bold flex items-center space-x-1">
        <ExclamationCircleIcon className="h-5 w-5" />
        <div>Error fetching issue data</div>
      </div>
    )

  const isPostPage = router.pathname === '/posts/[postId]'

  return (
    <div className="space-y-3 linkify">
      <div>
        <Link
          href={isPostPage ? issue?.html_url : `/posts/${post?.id}`}
          passHref
        >
          <a
            className="text-lg font-bold mb-1 flex items-center space-x-2"
            href={isPostPage ? issue?.html_url : `/posts/${post?.id}`}
            target={isPostPage ? '_blank' : '_self'}
            rel="noreferrer"
          >
            {issue?.state === 'open' ? (
              <Tooltip content="Open">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </Tooltip>
            ) : (
              <Tooltip content="Closed">
                <CheckCircleIconSolid className="h-5 w-5 text-brand-500" />
              </Tooltip>
            )}
            <div className="flex items-center space-x-1">
              <Tooltip content={`@${issue?.user?.login}`}>
                <a
                  href={issue?.user?.html_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    className="h-5 w-5 rounded-full border"
                    src={issue?.user?.avatar_url}
                    alt={issue?.user?.login}
                  />
                </a>
              </Tooltip>
              <div>{issue?.title}</div>
            </div>
            <div className="text-gray-500 font-normal">#{issue?.number}</div>
          </a>
        </Link>
        {issue?.labels?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 w-3/4 overflow-hidden pt-2">
            {issue?.labels?.map((label: any) => (
              <div
                className="rounded-full text-xs font-mono font-bold px-2 py-[1.5px]"
                key={label?.id}
                style={{
                  backgroundColor: `#${label?.color}`,
                  color: getTextColor(`#${label?.color}`),
                  border:
                    label?.color === 'ffffff' ? '1px solid #D1D5DB' : 'none'
                }}
              >
                {label?.name}
              </div>
            ))}
          </div>
        )}
        {isPostPage && (
          <div className="prose dark:prose-dark">
            <Markdown options={{ wrapper: 'article' }}>{issue?.body}</Markdown>
          </div>
        )}
        <div>
          {issue?.assignees?.length > 0 && (
            <div className="space-y-2 pt-3">
              <div className="font-bold">Assignees</div>
              <div className="flex space-x-1.5 overflow-hidden">
                {issue?.assignees?.map((user: any) => (
                  <a
                    key={user?.id}
                    href={`https://github.com/${user?.login}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      className="rounded-full border h-7 w-7"
                      src={imagekitURL(user?.avatar_url, 100, 100)}
                      alt={`@${user?.login}`}
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
          {issue?.milestone && (
            <div className="space-y-2 pt-3">
              <div className="font-bold">Milestone</div>
              <a
                className="flex items-center space-x-2"
                href={issue?.milestone?.html_url}
                target="_blank"
                rel="noreferrer"
              >
                <FlagIcon className="h-4 w-4 text-gray-500" />
                <div>{issue?.milestone?.title}</div>
              </a>
            </div>
          )}
          {issue?.reactions?.total_count > 0 && (
            <div className="space-x-2 pt-4 flex text-xs">
              <Reacttion emoji="👍" count={issue?.reactions['+1']} />
              <Reacttion emoji="👎" count={issue?.reactions['-1']} />
              <Reacttion emoji="😄" count={issue?.reactions?.laugh} />
              <Reacttion emoji="🎉" count={issue?.reactions?.hooray} />
              <Reacttion emoji="😕" count={issue?.reactions?.confused} />
              <Reacttion emoji="❤️" count={issue?.reactions?.heart} />
              <Reacttion emoji="🚀" count={issue?.reactions?.rocket} />
              <Reacttion emoji="👀" count={issue?.reactions?.eyes} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssueType

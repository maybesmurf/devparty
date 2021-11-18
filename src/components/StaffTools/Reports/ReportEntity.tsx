import { Report } from '@graphql/types.generated'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import React from 'react'

interface Props {
  report: Report
}

const ReportEntity: React.FC<Props> = ({ report }) => {
  return (
    <div className="linkify font-bold">
      {report?.type === 'POST' && (
        <a
          className="flex items-center space-x-1"
          href={`/posts/${report?.post?.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <div>Open the post</div>
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      )}
      {report?.type === 'USER' && (
        <a
          className="flex items-center space-x-1"
          href={`/u/${report?.post?.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <div>Open the user</div>
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      )}
      {report?.type === 'PRODUCT' && (
        <a
          className="flex items-center space-x-1"
          href={`/products/${report?.post?.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <div>Open the product</div>
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      )}
      {report?.type === 'COMMUNITY' && (
        <a
          className="flex items-center space-x-1"
          href={`/communities/${report?.post?.id}`}
          target="_blank"
          rel="noreferrer"
        >
          <div>Open the community</div>
          <ExternalLinkIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}

export default ReportEntity

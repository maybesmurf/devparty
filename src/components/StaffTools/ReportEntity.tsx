import { ExternalLinkIcon } from '@heroicons/react/outline'
import React from 'react'
import { Report } from 'src/__generated__/schema.generated'

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
    </div>
  )
}

export default ReportEntity
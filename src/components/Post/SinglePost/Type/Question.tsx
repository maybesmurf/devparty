import { Post } from '@graphql/types.generated'
import Markdown from 'markdown-to-jsx'
import React from 'react'

import Attachments from '../Attachments'

interface Props {
  question: Post
}

const QuestionType: React.FC<Props> = ({ question }) => {
  return (
    <div className="post space-y-3">
      <div>
        <div className="text-lg font-bold mb-1">{question?.title}</div>
        <div className="prose dark:prose-dark">
          <Markdown options={{ wrapper: 'article' }}>{question?.body}</Markdown>
        </div>
      </div>
      {question?.attachments && (
        <Attachments attachments={question?.attachments} />
      )}
    </div>
  )
}

export default QuestionType

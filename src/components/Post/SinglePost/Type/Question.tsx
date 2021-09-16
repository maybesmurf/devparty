import Markdown from 'markdown-to-jsx'
import React from 'react'
import { Post } from 'src/__generated__/schema.generated'

import Attachments from '../Attachments'

interface Props {
  question: Post
}

const QuestionType: React.FC<Props> = ({ question }) => {
  return (
    <div className="post space-y-3 inline-flex">
      <div>
        <div className="text-lg font-bold mb-1">{question?.title}</div>
        <div className="prose">
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

import React from 'react'
import { Post } from '~/__generated__/schema.generated'
import Markdown from 'markdown-to-jsx'

interface Props {
  question: Post
}

const QuestionType: React.FC<Props> = ({ question }) => {
  return (
    <div className="text-xl post">
      <div className="font-bold mb-1">{question?.title}</div>
      <div className="prose">
        <Markdown options={{ wrapper: 'article' }}>{question?.body}</Markdown>
      </div>
    </div>
  )
}

export default QuestionType

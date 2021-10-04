import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Card, CardBody } from '@components/ui/Card'
import { linkifyOptions } from '@components/utils/linkifyOptions'
import Linkify from 'linkify-react'
import React from 'react'
import { Post } from 'src/__generated__/schema.generated'

import {
  AnswerPollMutation,
  AnswerPollMutationVariables,
  PostPollQuery
} from './__generated__/Poll.generated'

export const POST_POLL_QUERY = gql`
  query PostPollQuery($id: ID!) {
    post(id: $id) {
      id
      poll {
        id
        hasVoted
        totalCount
        answers {
          id
          title
          hasAnswered
          voters {
            totalCount
          }
        }
      }
    }
  }
`

interface Props {
  post: Post
}

const PollType: React.FC<Props> = ({ post }) => {
  const [answerPoll] = useMutation<
    AnswerPollMutation,
    AnswerPollMutationVariables
  >(
    gql`
      mutation AnswerPollMutation($input: AnswerPollInput!) {
        answerPoll(input: $input) {
          id
          title
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: POST_POLL_QUERY,
          variables: { id: post?.id }
        }
      ]
    }
  )
  const { data, loading } = useQuery<PostPollQuery>(POST_POLL_QUERY, {
    variables: {
      id: post.id
    },
    skip: !post.id
  })
  const poll = data?.post?.poll

  return (
    <div className="space-y-3">
      <div className="linkify">
        <Linkify tagName="div" options={linkifyOptions}>
          {post?.body}
        </Linkify>
      </div>
      <Card className="!bg-gray-100 dark:!bg-gray-800">
        <CardBody className="space-y-3">
          {loading ? (
            <div>Loading Poll...</div>
          ) : (
            poll?.answers?.map((answer: any) => (
              <button
                key={answer?.id}
                type="button"
                className="bg-gray-200 px-3 py-2 rounded-lg flex items-center justify-between w-full"
                style={{
                  backgroundColor: answer?.hasAnswered ? '#C4B5FD' : '#E5E7EB'
                }}
                onClick={() =>
                  answerPoll({ variables: { input: { id: answer?.id } } })
                }
              >
                <div>{answer?.title}</div>
                <div className="font-bold text-sm">
                  {answer?.voters?.totalCount} votes
                </div>
              </button>
            ))
          )}
          <div className="text-gray-500 dark:text-gray-300">
            {poll?.totalCount} votes
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PollType

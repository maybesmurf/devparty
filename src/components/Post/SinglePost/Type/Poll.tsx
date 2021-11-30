import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import { gql, useMutation, useQuery } from '@apollo/client'
import { Card, CardBody } from '@components/UI/Card'
import { linkifyOptions } from '@components/utils/linkifyOptions'
import {
  AnswerPollMutation,
  AnswerPollMutationVariables,
  Post,
  PostPollQuery
} from '@graphql/types.generated'
import { humanize } from '@lib/humanize'
import Linkify from 'linkify-react'
import React from 'react'
import toast from 'react-hot-toast'

export const POST_POLL_QUERY = gql`
  query PostPoll($id: ID!) {
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

interface PollAnswerType {
  __typename?: 'PollAnswer'
  id: string
  title: string
  hasAnswered: boolean
  voters: { __typename?: 'PollAnswerVotersConnection'; totalCount: number }
}

interface Props {
  post: Post
}

const PollType: React.FC<Props> = ({ post }) => {
  const [answerPoll] = useMutation<
    AnswerPollMutation,
    AnswerPollMutationVariables
  >(
    gql`
      mutation AnswerPoll($input: AnswerPollInput!) {
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
      ],
      onError() {
        toast.error('You have already voted!')
      },
      onCompleted() {
        toast.success('Voted successfully!')
      }
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
            poll?.answers?.map((answer: PollAnswerType) => (
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
                  {humanize(answer?.voters?.totalCount)} votes
                </div>
              </button>
            ))
          )}
          <div className="text-gray-500 dark:text-gray-300">
            {humanize(poll?.totalCount as number)} votes
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default PollType

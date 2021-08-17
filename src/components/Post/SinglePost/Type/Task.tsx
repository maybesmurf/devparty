import { gql, useMutation } from '@apollo/client'
import * as linkify from 'linkifyjs'
import hashtag from 'linkifyjs/plugins/hashtag'
import Linkify from 'linkifyjs/react'
import React from 'react'
import toast from 'react-hot-toast'

import { Post } from '../../../../__generated__/schema.generated'
import { TaskCheckbox } from '../../../ui/TaskCheckbox'
import { linkifyOptions } from '../../../utils/linkifyOptions'
import Attachments from '../Attachments'
import {
  EditPostMutation,
  EditPostMutationVariables
} from './__generated__/Task.generated'

interface Props {
  task: Post
}

hashtag(linkify)

const TaskType: React.FC<Props> = ({ task }) => {
  const [editPost, editPostResult] = useMutation<
    EditPostMutation,
    EditPostMutationVariables
  >(
    gql`
      mutation EditPostMutation($input: EditPostInput!) {
        editPost(input: $input) {
          id
          body
          done
        }
      }
    `,
    {
      onError() {
        toast.error('Something went wrong!')
      },
      onCompleted() {
        toast.success('Task updated successfully!')
      }
    }
  )

  const toggleTaskStatus = () => {
    editPost({ variables: { input: { id: task?.id, done: !task?.done } } })
  }

  return (
    <div className="text-lg linkify space-y-3 inline-flex">
      <div className="flex items-center gap-2.5">
        <TaskCheckbox checked={task?.done} onChange={toggleTaskStatus} />
        <Linkify options={linkifyOptions}>{task?.body}</Linkify>
      </div>
      {task?.attachments && <Attachments attachments={task?.attachments} />}
    </div>
  )
}

export default TaskType

import { gql, useMutation } from '@apollo/client'
import Attachments from '@components/Post/SinglePost/Attachments'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import { Tooltip } from '@components/UI/Tooltip'
import {
  CreateQuestionMutation,
  CreateQuestionMutationVariables
} from '@graphql/types.generated'
import {
  EyeIcon,
  EyeOffIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/outline'
import Markdown from 'markdown-to-jsx'
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import Attachment from '../Attachment'
import SelectTarget from '../SelectTarget'

const newQuestionSchema = object({
  title: string()
    .min(1, { message: '❓ Title should not be empty' })
    .max(190, { message: '❓ Title should not exceed 190 characters' }),
  body: string()
    .min(1, { message: '❓ Question should not be empty' })
    .max(10000, { message: '❓ Question should not exceed 10000 characters' })
})

const QuestionType: React.FC = () => {
  const router = useRouter()
  const [attachments, setAttachments] = useState<string[]>([])
  const [selectedTarget, setSelectedTarget] = useState({
    targetId: '',
    targetType: ''
  })
  const [preview, setPreview] = useState<boolean>(false)
  const [createQuestion, createQuestionResult] = useMutation<
    CreateQuestionMutation,
    CreateQuestionMutationVariables
  >(
    gql`
      mutation CreateQuestion($input: CreatePostInput!) {
        createPost(input: $input) {
          id
          body
        }
      }
    `,
    {
      onCompleted(data) {
        setAttachments([])
        form.reset()
        toast.success('Question has been created successfully!')
        router.push(`/posts/${data?.createPost?.id}`)
      }
    }
  )

  const form = useZodForm({
    schema: newQuestionSchema
  })

  return (
    <Form
      form={form}
      className="space-y-1"
      onSubmit={({ title, body }) =>
        createQuestion({
          variables: {
            input: {
              title,
              body,
              type: 'QUESTION',
              attachments:
                attachments.length > 0 ? JSON.stringify(attachments) : null,
              targetId: selectedTarget.targetId,
              targetType: selectedTarget.targetType
            }
          }
        })
      }
    >
      <ErrorMessage
        title="Failed to create question"
        error={createQuestionResult.error}
      />
      {preview ? (
        <div className="text-xl post">
          <div className="font-bold mb-1">{form.getValues('title')}</div>
          <div className="prose dark:prose-dark">
            <Markdown options={{ wrapper: 'article' }}>
              {form.getValues('body')}
            </Markdown>
          </div>
        </div>
      ) : (
        <>
          <Input
            {...form.register('title')}
            className="mb-2"
            placeholder="What's the thing?"
          />
          <TextArea
            {...form.register('body')}
            placeholder="Ask anything about code"
          />
        </>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Attachment
            attachments={attachments}
            setAttachments={setAttachments}
          />
          <SelectTarget setSelectedTarget={setSelectedTarget} />
          <Tooltip content="Preview Markdown">
            <Button
              type="button"
              variant="success"
              size="sm"
              outline
              icon={
                preview ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )
              }
              onClick={() => setPreview(!preview)}
            />
          </Tooltip>
        </div>
        <Button
          type="submit"
          icon={
            form.formState.isSubmitting ? (
              <Spinner size="xs" />
            ) : (
              <QuestionMarkCircleIcon className="h-4 w-4" />
            )
          }
        >
          Ask
        </Button>
      </div>
      <Attachments
        attachments={attachments}
        setAttachments={setAttachments}
        isNew
      />
    </Form>
  )
}

export default QuestionType

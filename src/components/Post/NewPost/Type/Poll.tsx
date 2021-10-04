import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/ui/Button'
import { Card, CardBody } from '@components/ui/Card'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { Form, useZodForm } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Spinner } from '@components/ui/Spinner'
import { ChartBarIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import SelectProduct from '../SelectProduct'
import {
  NewPostMutation,
  NewPostMutationVariables
} from './__generated__/Post.generated'

const newPollSchema = object({
  title: string()
    .min(1, { message: '🗳️ Poll Title should not be empty' })
    .max(190, { message: '🗳️ Poll Title should not exceed 190 characters' })
})

const PollType: React.FC = () => {
  const router = useRouter()
  const [attachments, setAttachments] = useState<string[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string>('')
  const [createPost, createPostResult] = useMutation<
    NewPostMutation,
    NewPostMutationVariables
  >(
    gql`
      mutation NewPostMutation($input: CreatePostInput!) {
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
        toast.success('Poll has been created successfully!')
        router.push(`/posts/${data?.createPost?.id}`)
      }
    }
  )

  const form = useZodForm({
    schema: newPollSchema
  })

  return (
    <Form
      form={form}
      className="space-y-1"
      onSubmit={({ url, done }) =>
        createPost({
          variables: {
            input: {
              body: url,
              done,
              type: 'COMMIT',
              attachments:
                attachments.length > 0 ? JSON.stringify(attachments) : null,
              productId: selectedProduct as string
            }
          }
        })
      }
    >
      <ErrorMessage
        title="Failed to create poll"
        error={createPostResult.error}
      />
      <div className="mb-1.5 space-y-3">
        <Input {...form.register('title')} placeholder="Title of your poll" />
        <Card>
          <CardBody className="space-y-2">
            <div>
              <Input {...form.register('title')} placeholder="Choice 1" />
            </div>
            <div>
              <Input {...form.register('title')} placeholder="Choice 2" />
            </div>
            <div>
              <Input {...form.register('title')} placeholder="Choice 3" />
            </div>
            <div>
              <Input {...form.register('title')} placeholder="Choice 4" />
            </div>
          </CardBody>
        </Card>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <SelectProduct setSelectedProduct={setSelectedProduct} />
        </div>
        <Button
          type="submit"
          icon={
            form.formState.isSubmitting ? (
              <Spinner size="xs" />
            ) : (
              <ChartBarIcon className="h-4 w-4" />
            )
          }
        >
          Create Poll
        </Button>
      </div>
    </Form>
  )
}

export default PollType

import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/ui/Button'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { Form, useZodForm } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Spinner } from '@components/ui/Spinner'
import { DocumentAddIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { boolean, object, string } from 'zod'

import SelectProduct from '../SelectProduct'
import {
  NewPostMutation,
  NewPostMutationVariables
} from './__generated__/Post.generated'

const newPostSchema = object({
  url: string()
    .regex(
      /(?:http:\/\/)?(?:www\.)?github\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*([\w\-]*)/,
      { message: '🐙 Enter the valid GitHub Commit URL' }
    )
    .url({ message: '🐙 Enter the valid GitHub Commit URL' })
    .min(1, { message: '🐙 Commit URL should not be empty' })
    .max(10000, {
      message: '🐙 Commit URL should not exceed 10000 characters'
    }),
  done: boolean().default(true)
})

const CommitType: React.FC = () => {
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
        toast.success('Task has been created successfully!')
        router.push(`/posts/${data?.createPost?.id}`)
      }
    }
  )

  const form = useZodForm({
    schema: newPostSchema
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
        title="Failed to create task"
        error={createPostResult.error}
      />
      <div className="flex items-center mb-1.5 gap-2.5">
        <Input {...form.register('url')} placeholder="Git Commit URL" />
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
              <DocumentAddIcon className="h-4 w-4" />
            )
          }
        >
          Post Commit
        </Button>
      </div>
    </Form>
  )
}

export default CommitType
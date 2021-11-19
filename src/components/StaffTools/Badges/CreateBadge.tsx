import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import {
  CreateBadgeMutation,
  CreateBadgeMutationVariables
} from '@graphql/types.generated'
import { PlusCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import { GET_STAFF_BADGES_QUERY } from '.'

const createBadgeSchema = object({
  name: string().min(0).max(255),
  url: string().url(),
  description: string()
})

interface Props {
  setShowNewBadgeModal: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateBadge: React.FC<Props> = ({ setShowNewBadgeModal }) => {
  const [createBadge] = useMutation<
    CreateBadgeMutation,
    CreateBadgeMutationVariables
  >(
    gql`
      mutation CreateBadge($input: CreateBadgeInput!) {
        createBadge(input: $input) {
          id
        }
      }
    `,
    {
      refetchQueries: [{ query: GET_STAFF_BADGES_QUERY }],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        setShowNewBadgeModal(false)
        toast.success('Badge created successfully!')
      }
    }
  )

  const form = useZodForm({
    schema: createBadgeSchema
  })

  return (
    <Form
      form={form}
      onSubmit={({ name, url, description }) =>
        createBadge({
          variables: { input: { name, image: url, description } }
        })
      }
    >
      <div className="px-5 py-3.5 space-y-5">
        <div>
          <Input
            label="Title"
            placeholder="1 Year Club Badge"
            {...form.register('name')}
          />
        </div>
        <div>
          <Input
            label="URL"
            placeholder="https://assets.devparty.io/badges/1.png"
            {...form.register('url')}
          />
        </div>
        <div>
          <TextArea
            label="Description"
            placeholder="Tell somethin' about the badge"
            {...form.register('description')}
          />
        </div>
      </div>
      <div className="p-5 border-t dark:border-gray-800">
        <Button icon={<PlusCircleIcon className="h-5 w-4" />}>Create</Button>
      </div>
    </Form>
  )
}

export default CreateBadge

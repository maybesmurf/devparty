import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { TextArea } from '@components/UI/TextArea'
import {
  AwardBadgeMutation,
  AwardBadgeMutationVariables
} from '@graphql/types.generated'
import { GiftIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

const awardBadgeSchema = object({
  users: string()
})

interface Props {
  setShowAwardBadgeModal: React.Dispatch<React.SetStateAction<boolean>>
  selectedBadgeID: string
}

const AwardBadge: React.FC<Props> = ({
  setShowAwardBadgeModal,
  selectedBadgeID
}) => {
  const [awardBadge] = useMutation<
    AwardBadgeMutation,
    AwardBadgeMutationVariables
  >(
    gql`
      mutation AwardBadge($input: AwardBadgeInput!) {
        awardBadge(input: $input)
      }
    `,
    {
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        setShowAwardBadgeModal(false)
        toast.success('Badge created successfully!')
      }
    }
  )

  const form = useZodForm({
    schema: awardBadgeSchema
  })

  return (
    <Form
      form={form}
      onSubmit={({ users }) =>
        awardBadge({
          variables: { input: { users } }
        })
      }
    >
      <div className="px-5 py-3.5 space-y-5">
        <div>
          <Input label="Badge ID" value={selectedBadgeID} disabled />
        </div>
        <div>
          <TextArea
            label="Users"
            placeholder="username1, username2, username3, ..."
            {...form.register('users')}
          />
        </div>
      </div>
      <div className="p-5 border-t dark:border-gray-800">
        <Button icon={<GiftIcon className="h-5 w-4" />}>Award</Button>
      </div>
    </Form>
  )
}

export default AwardBadge

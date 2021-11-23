import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Modal } from '@components/UI/Modal'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import {
  AddTipTierMutation,
  AddTipTierMutationVariables
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import { GET_TIP_TIERS_QUERY } from '.'

const addTierSchema = object({
  name: string(),
  description: string(),
  amount: string()
})

interface Props {
  showAddTierModal: boolean
  setShowAddTierModal: React.Dispatch<React.SetStateAction<boolean>>
}

const AddTier: React.FC<Props> = ({
  showAddTierModal,
  setShowAddTierModal
}) => {
  const [addTipTier] = useMutation<
    AddTipTierMutation,
    AddTipTierMutationVariables
  >(
    gql`
      mutation AddTipTier($input: AddTipTierInput!) {
        addTipTier(input: $input)
      }
    `,
    {
      refetchQueries: [{ query: GET_TIP_TIERS_QUERY }],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        setShowAddTierModal(false)
        toast.success('Readme successfully updated!')
      }
    }
  )

  const form = useZodForm({
    schema: addTierSchema
  })

  return (
    <Modal
      title="Add new tier"
      show={showAddTierModal}
      onClose={() => setShowAddTierModal(false)}
    >
      <Form
        form={form}
        onSubmit={({ name, description, amount }) =>
          addTipTier({
            variables: {
              input: { name, description, amount: parseInt(amount) }
            }
          })
        }
      >
        <div className="px-5 py-3.5 space-y-2">
          <div>
            <Input
              label="Name"
              placeholder="Name your tier"
              {...form.register('name')}
            />
          </div>
          <div>
            <TextArea
              label="Description"
              placeholder="Say somethin' about this tier"
              {...form.register('description')}
            />
          </div>
          <div>
            <Input
              label="Amount in ETH"
              type="number"
              step="0.01"
              placeholder="0.5"
              prefix="ETH"
              {...form.register('amount')}
            />
          </div>
        </div>
        <div className="px-5 py-3.5 flex space-x-3 border-t">
          <Button
            className="ml-auto"
            icon={
              form.formState.isSubmitting ? (
                <Spinner size="xs" />
              ) : (
                <CheckCircleIcon className="h-4 w-4" />
              )
            }
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default AddTier

import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Modal } from '@components/UI/Modal'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import {
  EditProfileReadmeMutation,
  EditProfileReadmeMutationVariables
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import { GET_PROFILE_README_QUERY } from '.'

const editReadmeSchema = object({
  readme: string()
})

interface Props {
  readme: string
  showReadmeModal: boolean
  setShowReadmeModal: React.Dispatch<React.SetStateAction<boolean>>
}

const EditReadme: React.FC<Props> = ({
  readme,
  showReadmeModal,
  setShowReadmeModal
}) => {
  const { currentUser } = useContext(AppContext)
  const [editProfileReadme] = useMutation<
    EditProfileReadmeMutation,
    EditProfileReadmeMutationVariables
  >(
    gql`
      mutation EditProfileReadme($input: EditProfileReadmeInput!) {
        editProfileReadme(input: $input) {
          profile {
            readme
          }
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: GET_PROFILE_README_QUERY,
          variables: { username: currentUser?.username }
        }
      ],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        setShowReadmeModal(false)
        toast.success('Readme successfully updated!')
      }
    }
  )

  const form = useZodForm({
    schema: editReadmeSchema,
    defaultValues: { readme }
  })

  return (
    <Modal
      title="Edit README"
      show={showReadmeModal}
      size="lg"
      onClose={() => setShowReadmeModal(false)}
    >
      <Form
        form={form}
        onSubmit={({ readme }) => {
          editProfileReadme({
            variables: { input: { readme } }
          })
        }}
      >
        <div className="px-5 py-3.5">
          <TextArea
            placeholder="Say somethin' about you!"
            rows={17}
            {...form.register('readme')}
          />
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

export default EditReadme

import 'emoji-mart/css/emoji-mart.css'

import { gql, useMutation } from '@apollo/client'
import { CURRENT_USER_QUERY } from '@components/SiteLayout'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import {
  ClearStatusMutation,
  ClearStatusMutationVariables,
  EditStatusMutation,
  EditStatusMutationVariables
} from '@graphql/types.generated'
import { EmojiHappyIcon } from '@heroicons/react/outline'
import { Picker } from 'emoji-mart'
import { useTheme } from 'next-themes'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

const editStatusSchema = object({
  text: string().max(50, {
    message: '💝 Status text should not exceed 50 characters'
  })
})

interface Props {
  showStatusModal: boolean
  setShowStatusModal: React.Dispatch<React.SetStateAction<boolean>>
}

const SetStatus: React.FC<Props> = ({
  showStatusModal,
  setShowStatusModal
}) => {
  const { resolvedTheme } = useTheme()
  const { currentUser } = useContext(AppContext)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedEmoji, setSelectedEmoji] = useState<string | undefined>()
  const [editStatus] = useMutation<
    EditStatusMutation,
    EditStatusMutationVariables
  >(
    gql`
      mutation EditStatus($input: EditStatusInput!) {
        editStatus(input: $input) {
          emoji
          text
        }
      }
    `,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        setShowStatusModal(false)
        toast.success('Status successfully updated!')
      }
    }
  )

  const [clearStatus] = useMutation<
    ClearStatusMutation,
    ClearStatusMutationVariables
  >(
    gql`
      mutation ClearStatus {
        clearStatus
      }
    `,
    {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        form.reset()
        setSelectedEmoji(undefined)
        toast.success('Status cleared successfully!')
      }
    }
  )

  useEffect(() => {
    if (currentUser?.status?.emoji) setSelectedEmoji(currentUser?.status?.emoji)
  }, [currentUser])

  const form = useZodForm({
    schema: editStatusSchema,
    defaultValues: {
      text: currentUser?.status?.text
    }
  })

  return (
    <Modal
      title="Edit status"
      show={showStatusModal}
      onClose={() => setShowStatusModal(!showStatusModal)}
    >
      <Form
        form={form}
        className="space-y-4"
        onSubmit={({ text }) => {
          if (!selectedEmoji) return toast.error('Please select the emoji!')
          if (!form.watch('text')) return toast.error('Please type the status!')
          editStatus({
            variables: {
              input: { emoji: selectedEmoji as string, text }
            }
          })
        }}
      >
        <div className="px-5 py-3.5">
          <Input
            placeholder="What's poppin?"
            prefix={
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                {selectedEmoji ? (
                  selectedEmoji
                ) : (
                  <EmojiHappyIcon className="h-5 w-5" />
                )}
              </button>
            }
            {...form.register('text')}
          />
          <Modal
            title="Select emoji"
            show={showEmojiPicker}
            onClose={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Picker
              style={{ width: 'auto', border: 'none' }}
              onClick={(emoji: any) => {
                setSelectedEmoji(emoji.native)
                setShowEmojiPicker(false)
              }}
              theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
              showPreview={false}
              showSkinTones={false}
              emojiSize={20}
              color="#8b5cf6"
              native
            />
          </Modal>
        </div>
        <div className="px-5 py-3.5 flex space-x-3 border-t">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => clearStatus()}
          >
            Clear status
          </Button>
          <Button variant="success" className="w-full">
            Set status
          </Button>
        </div>
      </Form>
    </Modal>
  )
}

export default SetStatus

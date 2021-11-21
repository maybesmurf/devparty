import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import {
  EditOnboardingProfileMutation,
  EditOnboardingProfileMutationVariables,
  User
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

const editProfileSchema = object({
  username: string()
    .min(2, { message: '👤 Username should atleast have 2 characters' })
    .max(50, { message: '👤 Useranme should be within 50 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '👤 Invalid username' }),
  name: string()
    .min(2, { message: '👤 Name should atleast have 2 characters' })
    .max(50, { message: '👤 Name should be within 50 characters' }),
  bio: string()
    .max(190, { message: '👤 Bio should not exceed 190 characters' })
    .nullable(),
  location: string()
    .max(50, { message: '📍 Location should not exceed 50 characters' })
    .nullable()
})

interface Props {
  currentUser: User
  setShowSkip: React.Dispatch<React.SetStateAction<boolean>>
}

const ProfileForm: React.FC<Props> = ({ currentUser, setShowSkip }) => {
  const [editUser] = useMutation<
    EditOnboardingProfileMutation,
    EditOnboardingProfileMutationVariables
  >(
    gql`
      mutation EditOnboardingProfile($input: EditUserInput!) {
        editUser(input: $input) {
          id
          username
          profile {
            id
            bio
            location
          }
        }
      }
    `,
    {
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success('Profile updated successfully!')
      }
    }
  )

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      username: currentUser?.username,
      name: currentUser?.profile?.name,
      bio: currentUser?.profile?.bio as string,
      location: currentUser?.profile?.location as string
    }
  })

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ username, name, bio, location }) => {
        editUser({
          variables: {
            input: {
              username,
              email: currentUser?.email as string,
              name,
              bio: bio as string,
              location: location as string,
              avatar: currentUser?.profile?.avatar as string,
              cover: currentUser?.profile?.cover as string
            }
          }
        })
        setShowSkip(false)
      }}
    >
      <Input
        label="Username"
        type="text"
        placeholder="johndoe"
        prefix="https://devparty.io/u/"
        {...form.register('username')}
      />
      <Input
        label="Name"
        type="text"
        placeholder="John Doe"
        {...form.register('name')}
      />
      <TextArea
        label="Bio"
        placeholder="Tell us about yourself!"
        {...form.register('bio')}
      />
      <Input
        label="Location"
        type="text"
        placeholder="Czech Republic"
        {...form.register('location')}
      />
      <div className="ml-auto">
        <Button
          type="submit"
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
  )
}

export default ProfileForm

import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/ui/Button'
import { Card, CardBody } from '@components/ui/Card'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { Form, useZodForm } from '@components/ui/Form'
import { Input } from '@components/ui/Input'
import { Spinner } from '@components/ui/Spinner'
import { SuccessMessage } from '@components/ui/SuccessMessage'
import { TextArea } from '@components/ui/TextArea'
import ChooseFile from '@components/User/ChooseFile'
import { uploadToIPFS } from '@components/utils/uploadToIPFS'
import { CheckCircleIcon } from '@heroicons/react/outline'
import mixpanel from 'mixpanel-browser'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { User } from 'src/__generated__/schema.generated'
import { object, string } from 'zod'

import Sidebar from '../Sidebar'
import {
  ProfileSettingsMutation,
  ProfileSettingsMutationVariables
} from './__generated__/Form.generated'

const NFTAvatars = dynamic(() => import('./NFTAvatars'))

const editProfileSchema = object({
  username: string()
    .min(2, { message: '👤 Username should atleast have 2 characters' })
    .max(50, { message: '👤 Useranme should be within 50 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '👤 Invalid username' }),
  email: string().email({ message: '📧 Invalid email' }),
  name: string()
    .min(2, { message: '👤 Name should atleast have 2 characters' })
    .max(50, { message: '👤 Name should be within 50 characters' }),
  bio: string()
    .max(190, { message: '👤 Bio should not exceed 190 characters' })
    .nullable(),
  location: string()
    .max(50, { message: '📍 Location should not exceed 50 characters' })
    .nullable(),
  avatar: string()
})

interface Props {
  currentUser: User
}

const SUCCESS_MESSAGE = 'Profile successfully updated!'

const ProfileSettingsForm: React.FC<Props> = ({ currentUser }) => {
  const [avatar, setAvatar] = useState<string>()
  const [cover, setCover] = useState<string>()
  const [editUser, editUserResult] = useMutation<
    ProfileSettingsMutation,
    ProfileSettingsMutationVariables
  >(
    gql`
      mutation ProfileSettingsMutation($input: EditUserInput!) {
        editUser(input: $input) {
          id
          username
          email
          profile {
            id
            name
            bio
            location
            avatar
            cover
          }
        }
      }
    `,
    {
      onError() {
        mixpanel.track('user.profile.update.failed')
      },
      onCompleted() {
        toast.success(SUCCESS_MESSAGE)
        mixpanel.track('user.profile.update.success')
      }
    }
  )

  useEffect(() => {
    if (currentUser?.profile?.avatar) setAvatar(currentUser?.profile?.avatar)
    if (currentUser?.profile?.cover) setCover(currentUser?.profile?.cover)
  }, [currentUser])

  const handleUpload = async (evt: any, type: string) => {
    evt.preventDefault()
    // setLoading({ type, status: true })

    try {
      const attachment = await uploadToIPFS(evt.target.files)
      type === 'avatar' ? setAvatar(attachment.url) : setCover(attachment.url)
    } finally {
      // setLoading({ type, status: false })
    }
  }

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      username: currentUser.username,
      email: currentUser.email as string,
      name: currentUser.profile.name,
      bio: currentUser.profile.bio as string,
      location: currentUser.profile.location as string,
      avatar: currentUser.profile.avatar as string
    }
  })

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="mb-4">
          <CardBody>
            <Form
              form={form}
              className="space-y-4"
              onSubmit={({ username, email, name, bio, location }) => {
                mixpanel.track('user.profile.update.click')
                editUser({
                  variables: {
                    input: {
                      username,
                      email: email as string,
                      name,
                      bio: bio as string,
                      location: location as string,
                      avatar: avatar as string,
                      cover: cover as string
                    }
                  }
                })
              }}
            >
              <ErrorMessage
                title="Error updating profile"
                error={editUserResult.error}
              />
              {editUserResult.data && (
                <SuccessMessage>{SUCCESS_MESSAGE}</SuccessMessage>
              )}
              <Input label="ID" type="text" value={currentUser?.id} disabled />
              <Input
                label="Email"
                type="email"
                placeholder="me@johndoe.com"
                {...form.register('email')}
              />
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
              <div className="space-y-1.5">
                <label>Avatar</label>
                <div className="flex items-center gap-3">
                  <img
                    className="rounded-full h-24 w-24"
                    src={avatar}
                    alt={avatar}
                  />
                  <ChooseFile
                    onChange={(evt: any) => handleUpload(evt, 'avatar')}
                  />
                  {currentUser?.integrations?.ethAddress && (
                    <NFTAvatars
                      ethAddress={currentUser?.integrations?.ethAddress}
                    />
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <label>Cover</label>
                <div className="space-y-3">
                  {cover && (
                    <div>
                      <img
                        className="rounded-lg object-cover h-60 w-full"
                        style={{
                          backgroundColor: `#${currentUser?.profile?.coverBg}`
                        }}
                        src={cover}
                        alt={cover}
                      />
                    </div>
                  )}
                  <ChooseFile
                    onChange={(evt: any) => handleUpload(evt, 'cover')}
                  />
                </div>
              </div>

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
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default ProfileSettingsForm

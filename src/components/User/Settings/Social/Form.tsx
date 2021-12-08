import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import {
  EditUserSocialMutation,
  EditUserSocialMutationVariables,
  User
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import Sidebar from '../Sidebar'

const editUserSocialSchema = object({
  twitter: string()
    .max(50, { message: '👤 Username should be within 50 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '👤 Invalid Twitter username' })
    .nullable(),
  github: string()
    .max(50, { message: '👤 Username should be within 50 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '👤 Invalid GitHub username' })
    .nullable(),
  website: string()
    .max(100, { message: '🔗 Website url should be within 100 characters' })
    .url({ message: '🔗 Invalid URL' })
    .nullable(),
  discord: string()
    .max(50, { message: '👤 Username should be within 50 characters' })
    .regex(/^.{3,32}#[0-9]{4}$/, { message: '👤 Invalid Discord username' })
    .nullable()
})

interface Props {
  currentUser: User
}

const SUCCESS_MESSAGE = 'Social successfully updated!'

const SocialSettingsForm: React.FC<Props> = ({ currentUser }) => {
  const [editUserSocial] = useMutation<
    EditUserSocialMutation,
    EditUserSocialMutationVariables
  >(
    gql`
      mutation EditUserSocial($input: EditUserSocialInput!) {
        editUserSocial(input: $input) {
          profile {
            id
            twitter
            github
            website
            discord
          }
        }
      }
    `,
    {
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success(SUCCESS_MESSAGE)
      }
    }
  )

  const form = useZodForm({
    schema: editUserSocialSchema,
    defaultValues: {
      twitter: currentUser.profile.twitter as string,
      github: currentUser.profile.github as string,
      website: currentUser.profile.website as string,
      discord: currentUser.profile.discord as string
    }
  })

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <Form
              form={form}
              className="space-y-4"
              onSubmit={({ twitter, github, website, discord }) =>
                editUserSocial({
                  variables: {
                    input: { website, twitter, github, discord }
                  }
                })
              }
            >
              <Input
                label="Twitter"
                type="text"
                placeholder="johndoe"
                prefix="https://twitter.com/"
                {...form.register('twitter')}
              />
              <Input
                label="GitHub"
                type="text"
                placeholder="johndoe"
                prefix="https://github.com/"
                {...form.register('github')}
              />
              <Input
                label="Website"
                type="text"
                placeholder="https://johndoe.com"
                {...form.register('website')}
              />
              <Input
                label="Discord"
                type="text"
                placeholder="Johndoe#1998"
                {...form.register('discord')}
              />
              <div className="ml-auto pt-3">
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

export default SocialSettingsForm

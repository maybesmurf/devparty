import { gql, useMutation } from '@apollo/client'
import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Modal } from '@components/UI/Modal'
import { formatUsername } from '@components/utils/formatUsername'
import {
  ModUserMutation,
  ModUserMutationVariables,
  User
} from '@graphql/types.generated'
import {
  HashtagIcon,
  PencilIcon,
  ShieldCheckIcon,
  SwitchHorizontalIcon
} from '@heroicons/react/outline'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'
import { boolean, object } from 'zod'

import UpdateBadges from './UpdateBadges'

const modUserSchema = object({
  isVerified: boolean(),
  isStaff: boolean(),
  featuredAt: boolean(),
  spammy: boolean()
})

interface Props {
  user: User
}

const UserMod: React.FC<Props> = ({ user }) => {
  const [showUpdateBadgesModal, setShowUpdateBadgesModal] =
    useState<boolean>(false)
  const [modUser] = useMutation<ModUserMutation, ModUserMutationVariables>(
    gql`
      mutation ModUser($input: ModUserInput!) {
        modUser(input: $input) {
          id
          isVerified
          isStaff
          featuredAt
          spammy
        }
      }
    `,
    {
      onError() {
        toast.error(ERROR_MESSAGE)
      },
      onCompleted() {
        toast.success('User staff settings updated!')
      }
    }
  )

  const form = useZodForm({
    schema: modUserSchema,
    defaultValues: {
      isVerified: user?.isVerified as boolean,
      isStaff: user?.isStaff as boolean,
      featuredAt: user?.featuredAt ? true : false,
      spammy: user?.spammy as boolean
    }
  })

  return (
    <>
      <Card className="mt-5 border-yellow-400 !bg-yellow-300 !bg-opacity-20">
        <CardBody>
          <div className="font-bold text-lg">Details</div>
          <div className="space-y-1 mt-3 text-sm">
            <div className="flex items-center gap-1">
              <HashtagIcon className="h-4 w-4" />
              <span className="font-mono font-bold">{user?.id}</span>
            </div>
          </div>
          <div className="border-t border-yellow-400 my-3" />
          <div className="font-bold text-lg">Flags</div>
          <Form
            form={form}
            className="space-y-1.5 mt-3 text-sm font-bold"
            onSubmit={({ isVerified, isStaff, featuredAt, spammy }) =>
              modUser({
                variables: {
                  input: {
                    userId: user?.id,
                    isVerified,
                    isStaff,
                    featuredAt: featuredAt ? true : false,
                    spammy
                  }
                }
              })
            }
          >
            <div className="flex items-center gap-2">
              <input
                id="verifyUser"
                type="checkbox"
                {...form.register('isVerified')}
              />
              <label htmlFor="verifyUser">Verify the user</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="staffUser"
                type="checkbox"
                {...form.register('isStaff')}
              />
              <label htmlFor="staffUser">Make as staff</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="featuredAt"
                type="checkbox"
                {...form.register('featuredAt')}
              />
              <label htmlFor="featuredAt">Feature this user</label>
            </div>
            {!user?.isStaff && (
              <div className="flex items-center gap-2">
                <input
                  id="spammyUser"
                  type="checkbox"
                  {...form.register('spammy')}
                />
                <label htmlFor="spammyUser" className="text-red-500">
                  Mark as spammy
                </label>
              </div>
            )}
            <div className="pt-2 space-y-2">
              <div>
                <Button type="submit" icon={<PencilIcon className="h-4 w-4" />}>
                  {form.formState.isSubmitting ? 'Updating...' : 'Update'}
                </Button>
              </div>
              <div>
                <Button
                  type="button"
                  variant="success"
                  onClick={() =>
                    setShowUpdateBadgesModal(!showUpdateBadgesModal)
                  }
                  icon={<ShieldCheckIcon className="h-4 w-4" />}
                >
                  Update Badges
                </Button>
              </div>
              <div>
                <a href={`/api/masquerade/${user?.id}`}>
                  <Button
                    type="button"
                    icon={<SwitchHorizontalIcon className="h-4 w-4" />}
                  >
                    Masquerade
                  </Button>
                </a>
              </div>
            </div>
          </Form>
        </CardBody>
      </Card>
      {showUpdateBadgesModal && (
        <Modal
          onClose={() => setShowUpdateBadgesModal(!showUpdateBadgesModal)}
          title={
            <div className="flex items-center space-x-1.5">
              <div>Update badges for</div>
              <Slug slug={formatUsername(user?.username)} prefix="@" />
            </div>
          }
          show={showUpdateBadgesModal}
        >
          <UpdateBadges />
        </Modal>
      )}
    </>
  )
}

export default UserMod

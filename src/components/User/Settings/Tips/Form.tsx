import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import {
  EditTipsMutation,
  EditTipsMutationVariables,
  User
} from '@graphql/types.generated'
import { CheckCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import toast from 'react-hot-toast'
import { object, string } from 'zod'

import Sidebar from '../Sidebar'

const editTipsSchema = object({
  cash: string()
    .max(30, { message: 'Cashtag should be within 30 characters' })
    .nullable(),
  paypal: string()
    .max(30, { message: 'Paypal.me username should be within 30 characters' })
    .nullable(),
  github: string()
    .max(30, { message: 'GitHub username should be within 30 characters' })
    .nullable(),
  buymeacoffee: string()
    .max(30, {
      message: 'Buymeacoffee username should be within 30 characters'
    })
    .nullable(),
  bitcoin: string()
    .max(42, { message: 'Bitcoin address should be within 42 characters' })
    .nullable(),
  ethereum: string()
    .max(42, { message: 'Ethereum address should be within 42 characters' })
    .nullable()
})

interface Props {
  currentUser: User
}

const SUCCESS_MESSAGE = 'Tips successfully updated!'

const TipsSettingsForm: React.FC<Props> = ({ currentUser }) => {
  const [editTips] = useMutation<EditTipsMutation, EditTipsMutationVariables>(
    gql`
      mutation EditTips($input: EditTipsInput!) {
        editTips(input: $input) {
          id
          cash
          paypal
          github
          buymeacoffee
          bitcoin
          ethereum
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
    schema: editTipsSchema,
    defaultValues: {
      cash: currentUser.tip?.cash as string,
      paypal: currentUser.tip?.paypal as string,
      github: currentUser.tip?.github as string,
      buymeacoffee: currentUser.tip?.buymeacoffee as string,
      bitcoin: currentUser.tip?.bitcoin as string,
      ethereum: currentUser.tip?.ethereum as string
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
              onSubmit={({
                cash,
                paypal,
                github,
                buymeacoffee,
                bitcoin,
                ethereum
              }) =>
                editTips({
                  variables: {
                    input: {
                      cash,
                      paypal,
                      github,
                      buymeacoffee,
                      bitcoin,
                      ethereum
                    }
                  }
                })
              }
            >
              <Input
                label="Cashtag"
                type="text"
                placeholder="$johndoe"
                prefix="https://cash.app/"
                {...form.register('cash')}
              />
              <Input
                label="Paypal.me"
                type="text"
                placeholder="johndoe"
                prefix="https://paypal.me/"
                {...form.register('paypal')}
              />
              <Input
                label="GitHub"
                type="text"
                placeholder="johndoe"
                prefix="https://github.com/sponsors/"
                {...form.register('github')}
              />
              <Input
                label="Buy Me a Coffee"
                type="text"
                placeholder="johndoe"
                prefix="https://www.buymeacoffee.com/"
                {...form.register('buymeacoffee')}
              />
              <Input
                label="Bitcoin"
                type="text"
                placeholder="38gqtXyXUxB1mHR7mJf1bHzLSf6vHVBi6Q"
                {...form.register('bitcoin')}
              />
              <Input
                label="Ethereum"
                type="text"
                placeholder="0x635f595A4a0216106FA888773c0A6daCB4b3Ffc5"
                {...form.register('ethereum')}
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

export default TipsSettingsForm

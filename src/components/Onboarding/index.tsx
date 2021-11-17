import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Checkbox } from '@components/UI/Checkbox'
import { Form, useZodForm } from '@components/UI/Form'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { formatUsername } from '@components/utils/formatUsername'
import {
  AcceptCocAndTosMutation,
  AcceptCocAndTosMutationVariables
} from '@graphql/types.generated'
import { ArrowCircleRightIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import { boolean, object } from 'zod'

const acceptCOCAndTosSchema = object({
  coc: boolean(),
  tos: boolean()
})

const Onboarding: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const router = useRouter()
  const [acceptCocAndTos] = useMutation<
    AcceptCocAndTosMutation,
    AcceptCocAndTosMutationVariables
  >(
    gql`
      mutation AcceptCOCAndTOS($input: AcceptCOCAndTOSInput!) {
        acceptCocAndTos(input: $input) {
          id
        }
      }
    `,
    {
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        router.push('/onboarding/topics')
      }
    }
  )

  const form = useZodForm({
    schema: acceptCOCAndTosSchema
  })

  return (
    <div className="onboarding-bg page-center">
      <Card className="w-full sm:max-w-xl border-2 shadow-lg">
        <div className="bg-black rounded-t-none sm:rounded-t-lg py-8 px-5 text-white space-y-5">
          <img className="h-10 w-10" src="/white.svg" alt="Logo" />
          <div className="text-3xl font-bold space-y-1.5">
            <div className="truncate">
              @{formatUsername(currentUser?.username as string)}
            </div>
            <div>Welcome to Devparty!</div>
          </div>
          <div>A social network for developers and creators.</div>
        </div>
        <CardBody className="linkify space-y-2">
          <Form
            form={form}
            onSubmit={({ coc, tos }) =>
              acceptCocAndTos({ variables: { input: { coc, tos } } })
            }
          >
            <div className="flex items-center space-x-2">
              <Checkbox id="acceptCOC" {...form.register('coc')} />
              <label htmlFor="acceptCOC">
                You agree to uphold our <a href="/">Code of Conduct</a>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="acceptTOS" {...form.register('tos')} />
              <label htmlFor="acceptTOS">
                You agree to our <a href="/">Terms and Conditions</a>
              </label>
            </div>
            <div className="pt-5">
              <Button
                className="mx-auto"
                icon={
                  form.formState.isSubmitting ? (
                    <Spinner size="xs" />
                  ) : (
                    <ArrowCircleRightIcon className="h-4 w-4" />
                  )
                }
                disabled={!form.watch('coc') || !form.watch('tos')}
              >
                Continue
              </Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    </div>
  )
}

export default Onboarding

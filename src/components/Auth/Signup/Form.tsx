import { gql, useMutation } from '@apollo/client'
import { UserAddIcon } from '@heroicons/react/outline'
import React from 'react'
import { object, string } from 'zod'

import { Button } from '~/components/ui/Button'
import { Card, CardBody } from '~/components/ui/Card'
import { ErrorMessage } from '~/components/ui/ErrorMessage'
import { Form, useZodForm } from '~/components/ui/Form'
import { Input } from '~/components/ui/Input'
import { useAuthRedirect } from '~/components/utils/useAuthRedirect'

import {
  SignUpFormMutation,
  SignUpFormMutationVariables
} from './__generated__/Form.generated'

const signUpSchema = object({
  username: string().min(2).max(30),
  email: string().email(),
  password: string().min(6)
})

const SignupForm: React.FC = () => {
  const authRedirect = useAuthRedirect()
  const [signUp, signUpResult] = useMutation<
    SignUpFormMutation,
    SignUpFormMutationVariables
  >(
    gql`
      mutation SignUpFormMutation($input: SignUpInput!) {
        signUp(input: $input) {
          id
        }
      }
    `,
    {
      onCompleted() {
        authRedirect()
      }
    }
  )

  const form = useZodForm({
    schema: signUpSchema
  })

  return (
    <Card>
      <CardBody>
        <Form
          form={form}
          onSubmit={({ username, email, password }) =>
            signUp({
              variables: {
                input: { username, email, password }
              }
            })
          }
        >
          <ErrorMessage
            title="Error creating account"
            error={signUpResult.error}
            className="mb-2"
          />
          <div className="space-y-4">
            <div>
              <Input
                label="Username"
                type="text"
                autoComplete="username"
                placeholder="johndoe"
                autoFocus
                {...form.register('username')}
              />
            </div>
            <div>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="me@example.com"
                {...form.register('email')}
              />
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••••"
                {...form.register('password')}
              />
            </div>
            <Button
              type="submit"
              className=" w-full flex items-center justify-center space-x-1.5"
            >
              <UserAddIcon className="h-5 w-5" />
              <div>Sign Up</div>
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default SignupForm

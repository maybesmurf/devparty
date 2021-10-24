import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { CollectionIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React from 'react'
import { object, string } from 'zod'

import {
  JoinWaitlistFormMutation,
  JoinWaitlistFormMutationVariables
} from './__generated__/Form.generated'

export const signUpSchema = object({
  username: string()
    .min(2, { message: '👤 Username should atleast have 2 characters' })
    .max(30, { message: '👤 Useranme should be within 30 characters' })
    .regex(/^[a-z0-9_\.]+$/, { message: '👤 Invalid username' }),
  email: string().email({ message: '📧 Invalid email' }),
  password: string().min(6, {
    message: '👀 Password should atleast have 6 characters'
  })
})

const SignupForm: React.FC = () => {
  const router = useRouter()
  const [signUp, signUpResult] = useMutation<
    JoinWaitlistFormMutation,
    JoinWaitlistFormMutationVariables
  >(
    gql`
      mutation JoinWaitlistFormMutation($input: JoinWaitlistInput!) {
        joinWaitlist(input: $input) {
          id
          inWaitlist
        }
      }
    `,
    {
      onCompleted() {
        router.push('/waitlist')
      }
    }
  )

  const form = useZodForm({
    schema: signUpSchema
  })

  return (
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
        className="mb-3"
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
          size="lg"
          type="submit"
          className=" w-full justify-center"
          icon={
            form.formState.isSubmitting ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              <CollectionIcon className="h-5 w-5" />
            )
          }
        >
          Join Waitlist
        </Button>
      </div>
    </Form>
  )
}

export default SignupForm

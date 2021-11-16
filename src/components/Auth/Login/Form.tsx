import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { useAuthRedirect } from '@components/utils/hooks/useAuthRedirect'
import { LoginMutation, LoginMutationVariables } from '@graphql/types.generated'
import { LogoutIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React from 'react'
import { object, string } from 'zod'

const AuthWithWallet = dynamic(() => import('./AuthWithWallet'), {
  loading: () => <div className="w-full h-10 rounded-lg shimmer" />
})
const AuthWithGitHub = dynamic(() => import('./AuthWithGitHub'), {
  loading: () => <div className="w-full h-10 rounded-lg shimmer" />
})

const loginSchema = object({
  login: string().min(3, { message: '👤 Invalid login' }),
  password: string().min(4, {
    message: '👀 Password should atleast have 6 characters'
  })
})

const LoginForm: React.FC = () => {
  const authRedirect = useAuthRedirect()
  const router = useRouter()
  const [loginUser, loginResult] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(
    gql`
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          id
          inWaitlist
        }
      }
    `,
    {
      onCompleted(data) {
        if (data?.login?.inWaitlist) {
          router.push('/waitlist')
        } else {
          authRedirect()
        }
      }
    }
  )

  const form = useZodForm({
    schema: loginSchema
  })

  return (
    <Form
      form={form}
      onSubmit={({ login, password }) =>
        loginUser({ variables: { input: { login, password } } })
      }
    >
      <ErrorMessage
        title="Login failed."
        error={loginResult.error}
        className="mb-3"
      />
      <div className="space-y-4">
        <div>
          <Input
            label="Username or email"
            type="text"
            placeholder="johndoe"
            autoFocus
            {...form.register('login')}
          />
        </div>
        <div>
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••••"
            {...form.register('password')}
          />
        </div>
        <Button
          size="lg"
          type="submit"
          className="justify-center w-full "
          icon={
            form.formState.isSubmitting ? (
              <Spinner size="xs" className="mr-1" />
            ) : (
              <LogoutIcon className="w-5 h-5" />
            )
          }
        >
          Login
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <AuthWithWallet />
          <AuthWithGitHub />
        </div>
      </div>
    </Form>
  )
}

export default LoginForm

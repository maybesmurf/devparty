import { builder } from '@graphql/builder'
import { Prisma } from '@prisma/client'
import { authenticateUser } from '@utils/auth'
import { db } from '@utils/prisma'
import { createSession } from '@utils/sessions'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import { createLog } from '../Log/mutations/createLog'
import { Result } from '../ResultResolver'
import { changePassword } from './mutations/changePassword'
import { joinWaitlist } from './mutations/joinWaitlist'
import { signUp } from './mutations/signUp'
import { authWithWallet } from './queries/authWithWallet'

builder.queryField('me', (t) =>
  t.prismaField({
    type: 'User',
    nullable: true,
    skipTypeScopes: true,
    grantScopes: ['currentUser'],
    resolve: async (query, parent, args, { session }) => {
      if (!session?.userId) {
        return null
      }

      return await db.user.findUnique({
        ...query,
        where: { id: session.userId },
        rejectOnNotFound: true
      })
    }
  })
)

const LoginInput = builder.inputType('LoginInput', {
  fields: (t) => ({
    login: t.string({ validate: { minLength: 3 } }),
    password: t.string({ validate: { minLength: 4 } })
  })
})

builder.mutationField('login', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    args: { input: t.arg({ type: LoginInput }) },
    authScopes: { unauthenticated: false },
    nullable: true,
    resolve: async (_query, parent, { input }, { req }) => {
      const user = await authenticateUser(input.login, input.password)
      if (user.inWaitlist) {
        // Don't allow users in waitlist
        return user
      }

      if (user.spammy) {
        // Don't allow users to login if marked as spammy 😈
        throw new Error('Your account is suspended!')
      }
      try {
        await createSession(req, user, false)
        createLog(user?.id, user?.id, 'LOGIN')
        return user
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'VALIDATION') {
            throw new Error(error.message)
          }

          throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
        }
      }
    }
  })
)

const AuthWithWalletInput = builder.inputType('AuthWithWalletInput', {
  fields: (t) => ({
    nonce: t.string(),
    signature: t.string()
  })
})

builder.mutationField('authWithWallet', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    args: { input: t.arg({ type: AuthWithWalletInput }) },
    authScopes: { unauthenticated: false },
    nullable: true,
    resolve: async (query, parent, { input }, { req }) => {
      try {
        const user = await authWithWallet(query, input.nonce, input.signature)
        createLog(user?.id, user?.id, 'LOGIN')
        await createSession(req, user, false)

        return user
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
        }
      }
    }
  })
)

const JoinWaitlistInput = builder.inputType('JoinWaitlistInput', {
  fields: (t) => ({
    username: t.string({
      validate: {
        regex: /^[a-z0-9_\.]+$/,
        minLength: 1,
        maxLength: 30
      }
    }),
    email: t.string({ validate: { email: true } }),
    password: t.string({ validate: { minLength: 4 } })
  })
})

builder.mutationField('joinWaitlist', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    args: { input: t.arg({ type: JoinWaitlistInput }) },
    authScopes: { unauthenticated: true },
    resolve: async (query, parent, { input }) => {
      return joinWaitlist(query, input)
    }
  })
)

const SignupInput = builder.inputType('SignupInput', {
  fields: (t) => ({
    username: t.string({
      validate: {
        regex: /^[a-z0-9_\.]+$/,
        minLength: 1,
        maxLength: 30
      }
    }),
    email: t.string({ validate: { email: true } }),
    password: t.string({ validate: { minLength: 4 } }),
    invite: t.string({ validate: { minLength: 1, maxLength: 12 } })
  })
})

builder.mutationField('signUp', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    args: { input: t.arg({ type: SignupInput }) },
    authScopes: { unauthenticated: true },
    resolve: async (query, parent, { input }, { req }) => {
      return signUp(query, input, req)
    }
  })
)

const ChangePasswordInput = builder.inputType('ChangePasswordInput', {
  fields: (t) => ({
    currentPassword: t.string({ validate: { minLength: 4 } }),
    newPassword: t.string({ validate: { minLength: 4 } })
  })
})

builder.mutationField('changePassword', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: ChangePasswordInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }, { session }) => {
      return changePassword(input, session)
    }
  })
)

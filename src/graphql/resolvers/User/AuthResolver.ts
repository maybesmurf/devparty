import { builder } from '@graphql/builder'
import { authenticateUser } from '@utils/auth'
import { db } from '@utils/prisma'
import { createSession } from '@utils/sessions'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

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
    email: t.string({
      validate: {
        email: true
      }
    }),
    password: t.string({
      validate: {
        minLength: 6
      }
    })
  })
})

builder.mutationField('login', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: false
    },
    args: { input: t.arg({ type: LoginInput }) },
    resolve: async (_query, parent, { input }, { req }) => {
      try {
        const user = await authenticateUser(input.email, input.password)
        if (user.inWaitlist) {
          // Don't allow users in waitlist
          return user
        }

        if (user.spammy) {
          // Don't allow users to login if marked as spammy 😈
          throw new Error('Your account is suspended!')
        }

        await createSession(req, user)
        return user
      } catch (error: any) {
        throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error)
      }
    }
  })
)

const LoginWithWalletInput = builder.inputType('LoginWithWalletInput', {
  fields: (t) => ({
    address: t.string(),
    signature: t.string()
  })
})

builder.mutationField('loginWithWallet', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: false
    },
    args: { input: t.arg({ type: LoginWithWalletInput }) },
    resolve: async (_query, parent, { input }, { req }) => {
      try {
        const user = await authWithWallet(input.address, input.signature)

        await createSession(req, user)
        return user
      } catch (error: any) {
        throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error)
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
    email: t.string({
      validate: {
        email: true
      }
    }),
    password: t.string({
      validate: {
        minLength: 6
      }
    })
  })
})

builder.mutationField('joinWaitlist', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true
    },
    args: { input: t.arg({ type: JoinWaitlistInput }) },
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
    email: t.string({
      validate: {
        email: true
      }
    }),
    password: t.string({
      validate: {
        minLength: 6
      }
    }),
    invite: t.string({
      validate: {
        minLength: 1,
        maxLength: 12
      }
    })
  })
})

builder.mutationField('signUp', (t) =>
  t.prismaField({
    type: 'User',
    skipTypeScopes: true,
    authScopes: {
      unauthenticated: true
    },
    args: { input: t.arg({ type: SignupInput }) },
    resolve: async (query, parent, { input }, { req }) => {
      return signUp(query, input, req)
    }
  })
)

const ChangePasswordInput = builder.inputType('ChangePasswordInput', {
  fields: (t) => ({
    currentPassword: t.string({
      validate: { minLength: 6 }
    }),
    newPassword: t.string({
      validate: { minLength: 6 }
    })
  })
})

builder.mutationField('changePassword', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: ChangePasswordInput }) },
    resolve: async (parent, { input }, { session }) => {
      return changePassword(input, session)
    }
  })
)

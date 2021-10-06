import { createNotification } from '@graphql/resolvers/Notification/mutations/createNotification'
import { getRandomCover } from '@graphql/utils/getRandomCover'
import { hashPassword } from '@utils/auth'
import { db } from '@utils/prisma'
import { createSession } from '@utils/sessions'
import { md5 } from 'hash-wasm'
import { SignupInput } from 'src/__generated__/schema.generated'
import { ERROR_MESSAGE, IS_PRODUCTION, RESERVED_SLUGS } from 'src/constants'

export const signUp = async (query: any, input: SignupInput, req: any) => {
  if (RESERVED_SLUGS.includes(input.username)) {
    throw new Error(`Username "${input.username}" is reserved by Devparty.`)
  }

  const invite = await db.invite.findFirst({
    where: { code: input.invite }
  })

  if (!invite) {
    throw new Error('Invite code is invalid or expired.')
  }

  try {
    const user = await db.user.create({
      ...query,
      data: {
        username: input.username,
        email: input.email,
        hashedPassword: await hashPassword(input.password),
        inWaitlist: false,
        profile: {
          create: {
            name: input.username,
            avatar: `https://avatar.tobi.sh/${await md5(input.email)}.svg`,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color
          }
        },
        following: { connect: { id: invite.userId } },
        integrations: { create: {} }
      }
    })

    createNotification(user?.id, invite.userId, user?.id, 'USER_INVITE_FOLLOW')
    await createSession(req, user)
    await db.invite.updateMany({
      where: { code: input.invite },
      data: { usedTimes: { increment: 1 } }
    })

    return user
  } catch (error: any) {
    if (error.code === 'P2002') {
      if (error.meta.target === 'users_username_key')
        throw new Error('Username is already taken!')
      if (error.meta.target === 'users_email_key')
        throw new Error('Email is already taken!')
    }

    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error)
  }
}

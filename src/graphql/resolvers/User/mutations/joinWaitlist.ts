import { reservedSlugs } from '@graphql/resolvers/Common/queries/reservedSlugs'
import { getRandomCover } from '@graphql/utils/getRandomCover'
import { hashPassword } from '@utils/auth'
import { db } from '@utils/prisma'
import { md5 } from 'hash-wasm'
import { JoinWaitlistInput } from 'src/__generated__/schema.generated'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import { User } from '.prisma/client'

export const joinWaitlist = async (query: any, input: JoinWaitlistInput) => {
  if (reservedSlugs.includes(input.username)) {
    throw new Error(`Username "${input.username}" is reserved by Devparty.`)
  }

  try {
    const user: User = await db.user.create({
      ...query,
      data: {
        username: input.username,
        email: input.email,
        hashedPassword: await hashPassword(input.password),
        inWaitlist: true,
        profile: {
          create: {
            name: input.username,
            avatar: `https://avatar.tobi.sh/${await md5(input.email)}.svg`,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color
          }
        }
      }
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

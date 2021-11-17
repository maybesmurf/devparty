import { createLog } from '@graphql/resolvers/Log/mutations/createLog'
import { EditUserInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Add user to the waitlist
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditUserInput
 * @param session - Current user's session
 * @returns the user in the waitlist
 */
export const editUser = async (
  query: Record<string, unknown>,
  input: EditUserInput,
  session: Session | null | undefined
) => {
  try {
    const user = await db.user.update({
      ...query,
      where: { id: session!.userId },
      data: {
        username: input.username,
        email: input.email,
        profile: {
          update: {
            name: input.name,
            bio: input.bio,
            location: input.location,
            avatar: input.avatar,
            cover: input.cover
          }
        }
      }
    })
    createLog(session!.userId, user?.id, 'SETTINGS_UPDATE')

    return user
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target === 'users_username_key') {
      throw new Error('Username is already taken!')
    }

    if (error.code === 'P2002' && error.meta.target === 'users_email_key') {
      throw new Error('Email is already taken!')
    }

    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

import { createLog } from '@graphql/resolvers/Log/mutations/createLog'
import { EditUserSocialInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Add user to the waitlist
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditUserSocialInput
 * @param session - Current user's session
 * @returns the user in the waitlist
 */
export const editUserSocial = async (
  query: Record<string, unknown>,
  input: EditUserSocialInput,
  session: Session | null | undefined
) => {
  try {
    const user = await db.user.update({
      ...query,
      where: {
        id: session!.userId
      },
      data: {
        profile: {
          update: {
            website: input.website,
            twitter: input.twitter,
            github: input.github,
            discord: input.discord
          }
        }
      }
    })
    createLog(session!.userId, user?.id, 'SETTINGS_UPDATE')

    return user
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

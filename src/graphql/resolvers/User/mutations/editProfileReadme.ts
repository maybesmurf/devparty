import { EditProfileReadmeInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Edit profile readme
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditProfileReadmeInput
 * @param session - Current user's session
 * @returns the user
 */
export const editProfileReadme = async (
  query: Record<string, unknown>,
  input: EditProfileReadmeInput,
  session: Session | null | undefined
) => {
  try {
    return await db.user.update({
      ...query,
      where: { id: session!.userId },
      data: { profile: { update: { readme: input.readme } } }
    })
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

import { Result } from '@graphql/resolvers/ResultResolver'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Delete the user
 * @param session - Current user's session
 * @returns the result
 */
export const deleteAccount = async (session: Session | null | undefined) => {
  await db.user.delete({
    where: { id: session?.userId }
  })

  return Result.SUCCESS
}

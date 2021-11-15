import { db } from '@utils/prisma'

/**
 * Check whether user has readme or not
 * @param userId - Target user ID
 * @returns whether user has readme or not
 */
export const hasReadme = async (userId: string) => {
  const profile = await db.profile.findUnique({
    where: { userId },
    select: { readme: true }
  })

  return profile?.readme ? true : false
}

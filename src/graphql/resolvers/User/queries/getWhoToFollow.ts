import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Get list of tailored users to follow
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param session - Current user's session
 * @returns list of users to follow
 */
export const getWhoToFollow = async (
  query: Record<string, unknown>,
  session: Session | null | undefined
) => {
  const following = await db.user.findFirst({
    where: { id: session?.userId, inWaitlist: false },
    select: { following: { select: { id: true } } }
  })

  return await db.user.findMany({
    ...query,
    take: 5,
    where: {
      spammy: false,
      inWaitlist: false,
      id: {
        // @ts-ignore
        notIn: [...following.following.map((user) => user.id), session?.userId]
      }
    },
    orderBy: [
      { followedBy: { _count: 'desc' } },
      { posts: { _count: 'desc' } },
      { isVerified: 'desc' },
      { updatedAt: 'desc' },
      { following: { _count: 'desc' } }
    ]
  })
}

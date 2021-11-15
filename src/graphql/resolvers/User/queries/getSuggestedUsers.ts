import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Get list of suggested users to follow
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param session - Current user's session
 * @returns list of suggested users to follow
 */
export const getSuggestedUsers = async (
  query: Record<string, unknown>,
  session: Session | null | undefined
) => {
  const topics = await db.user.findFirst({
    where: { id: session?.userId, inWaitlist: false },
    select: { topics: { select: { id: true } } }
  })

  return await db.user.findMany({
    ...query,
    where: {
      spammy: false,
      inWaitlist: false,
      id: { notIn: session?.userId },
      topics: {
        some: {
          // @ts-ignore
          id: { in: [...topics?.topics.map((topic) => topic.id)] }
        }
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

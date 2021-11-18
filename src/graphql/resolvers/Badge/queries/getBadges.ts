import { db } from '@utils/prisma'

/**
 * Return all badges
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @returns all badges
 */
export const getBadges = async (query: any) => {
  return await db.badge.findMany({
    ...query,
    orderBy: { users: { _count: 'desc' } }
  })
}

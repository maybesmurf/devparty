import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Get list of current user's sessions
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param session - Current user's session
 * @returns list of current user's sessions
 */
export const getSessions = async (
  query: Record<string, unknown>,
  session: Session | null | undefined
) => {
  return await db.session.findMany({
    ...query,
    where: { userId: session?.userId, masquerading: false },
    orderBy: { createdAt: 'desc' }
  })
}

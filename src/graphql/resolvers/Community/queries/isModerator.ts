import { db } from '@utils/prisma'

/**
 * Check the user is a moderator in the community
 * @param userId - User ID to check
 * @param communityId - Community ID need to check
 * @returns whether user is moderator in the community or not
 */
export const isModerator = async (userId: string, communityId: string) => {
  const community = await db.community.findUnique({
    where: { id: communityId },
    include: { moderators: { where: { id: userId } } }
  })

  return community?.moderators?.length === 0 ? false : true
}

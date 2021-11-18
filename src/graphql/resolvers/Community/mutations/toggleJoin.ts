import { Prisma } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import { hasJoined } from '../queries/hasJoined'

/**
 * Join the community
 * @param currentUserId - Current user ID
 * @param communityId - Community ID need to join
 * @returns the joined community
 */
export const toggleJoin = async (
  currentUserId: string,
  communityId: string
) => {
  // Leave
  if (await hasJoined(currentUserId, communityId)) {
    const community = await db.community.findFirst({
      where: { id: communityId },
      select: { ownerId: true }
    })

    if (community?.ownerId === currentUserId) {
      throw new Error('You cannot leave the community you owned!')
    } else {
      try {
        const updatedCommunity = await db.community.update({
          where: { id: communityId },
          data: { members: { disconnect: { id: currentUserId } } }
        })

        return updatedCommunity
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
        }
      }
    }
  }

  // Join
  try {
    const community = await db.community.update({
      where: { id: communityId },
      data: { members: { connect: { id: currentUserId } } }
    })

    return community
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

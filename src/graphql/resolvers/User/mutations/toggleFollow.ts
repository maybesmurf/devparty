import { createNotification } from '@graphql/resolvers/Notification/mutations/createNotification'
import { Prisma } from '@prisma/client'
import { User } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import { hasFollowed } from '../queries/hasFollowed'

/**
 * Follow the give user
 * @param currentUserId - Current user ID
 * @param userId - Target user ID
 * @returns the followed user
 */
export const toggleFollow = async (currentUserId: string, userId: string) => {
  if (currentUserId === userId) {
    throw new Error("You can't follow yourself!")
  }

  try {
    // Unfollow
    if (await hasFollowed(currentUserId, userId)) {
      return await db.user.update({
        where: { id: userId },
        data: {
          followedBy: {
            disconnect: {
              id: currentUserId
            }
          }
        }
      })
    }

    // Follow
    const user: User = await db.user.update({
      where: { id: userId },
      data: {
        followedBy: {
          connect: {
            id: currentUserId
          }
        }
      }
    })

    if (userId !== currentUserId) {
      createNotification(currentUserId, userId, userId, 'USER_FOLLOW')
    }

    return user
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

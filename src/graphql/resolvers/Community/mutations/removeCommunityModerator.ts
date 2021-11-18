import { Result } from '@graphql/resolvers/ResultResolver'
import { RemoveCommunityModeratorInput } from '@graphql/types.generated'
import { Prisma, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Remove moderator from the community
 * @param input - RemoveCommunityModeratorInput
 * @param session - Current user's session
 * @returns RESULT
 */
export const removeCommunityModerator = async (
  input: RemoveCommunityModeratorInput,
  session: Session | null | undefined
) => {
  const community = await db.community.findUnique({
    where: { id: input.communityId },
    select: { id: true, owner: { select: { id: true } } },
    rejectOnNotFound: true
  })

  if (community?.owner?.id === input.userId) {
    throw new Error("Owner can't be removed from the community!")
  }

  if (community?.owner?.id === session?.userId) {
    try {
      await db.community.update({
        where: { id: community?.id },
        data: { moderators: { disconnect: { id: input.userId } } }
      })

      return Result.SUCCESS
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
      }
    }
  } else {
    throw new Error('You dont have permission to remove the moderator!')
  }
}

import { Result } from '@graphql/resolvers/ResultResolver'
import { AddCommunityModeratorInput } from '@graphql/types.generated'
import { Prisma, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Add moderator to the community
 * @param input - AddCommunityModeratorInput
 * @param session - Current user's session
 * @returns RESULT
 */
export const addCommunityModerator = async (
  input: AddCommunityModeratorInput,
  session: Session | null | undefined
) => {
  const community = await db.community.findUnique({
    where: { id: input.communityId },
    select: { id: true, owner: { select: { id: true } } },
    rejectOnNotFound: true
  })

  if (community?.owner?.id === input.userId) {
    throw new Error('Only owner can add mods to community!')
  }

  try {
    if (community?.owner?.id === session?.userId) {
      await db.community.update({
        where: { id: community?.id },
        data: { moderators: { connect: { id: input.userId } } }
      })

      return Result.SUCCESS
    } else {
      throw new Error('You dont have permission to add the user!')
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

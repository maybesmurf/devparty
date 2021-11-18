import { AddCommunityModeratorInput } from '@graphql/types.generated'
import { Prisma, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Add moderator to the community
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - AddCommunityModeratorInput
 * @param session - Current user's session
 * @returns RESULT
 */
export const addCommunityModerator = async (
  query: Record<string, unknown>,
  input: AddCommunityModeratorInput,
  session: Session | null | undefined
) => {
  const community = await db.community.findUnique({
    ...query,
    where: { id: input.communityId },
    select: { id: true, owner: { select: { id: true } } },
    rejectOnNotFound: true
  })

  if (community?.owner?.id === input.userId) {
    throw new Error('Only owner can add mods to community!')
  }

  try {
    if (community?.owner?.id === session?.userId) {
      return await db.community.update({
        ...query,
        where: { id: community?.id },
        data: { members: { connect: { id: input.userId } } }
      })
    } else {
      throw new Error('You dont have permission to add the user!')
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

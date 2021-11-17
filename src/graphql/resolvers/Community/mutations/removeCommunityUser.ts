import { RemoveCommunityUserInput } from '@graphql/types.generated'
import { Prisma, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Remove user from the community
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - RemoveCommunityUserInput
 * @param session - Current user's session
 * @returns RESULT
 */
export const removeCommunityUser = async (
  query: Record<string, unknown>,
  input: RemoveCommunityUserInput,
  session: Session | null | undefined
) => {
  const community = await db.community.findUnique({
    ...query,
    where: { id: input.communityId },
    select: { id: true, owner: { select: { id: true } } },
    rejectOnNotFound: true
  })

  if (community?.owner?.id === input.userId) {
    throw new Error("Owner can't be removed from the community!")
  }

  try {
    if (community?.owner?.id === session?.userId) {
      return await db.community.update({
        ...query,
        where: { id: community?.id },
        data: { members: { disconnect: { id: input.userId } } }
      })
    } else {
      throw new Error('You dont have permission to remove the user!')
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

import { Result } from '@graphql/resolvers/ResultResolver'
import { AwardBadgeInput } from '@graphql/types.generated'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Creates a new community
 * @param input - AwardBadgeInput
 * @returns a new community
 */
export const awardBadge = async (input: AwardBadgeInput) => {
  try {
    const list = input.users
      .split(/[ ,]+/)
      .filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) === index
      })

    const users = await db.user.findMany({
      where: { username: { in: list } },
      select: { id: true }
    })

    await db.badge.update({
      where: { id: input.badgeId },
      data: { users: { connect: users } }
    })

    return Result.SUCCESS
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error)
  }
}

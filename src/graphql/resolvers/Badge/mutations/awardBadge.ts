import { Result } from '@graphql/resolvers/ResultResolver'
import { AwardBadgeInput } from '@graphql/types.generated'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Creates a new community
 * @param input - AwardBadgeInput
 * @returns a new community
 */
export const awardBadge = async (input: AwardBadgeInput) => {
  try {
    const users = input.users
      .split(/[ ,]+/)
      .filter(function (item, index, inputArray) {
        return inputArray.indexOf(item) === index
      })
    console.log(users)
    // await db.community.create({
    //   data: {
    //     name: input.name,
    //     slug: input.slug,
    //     description: input.description,
    //     avatar: `https://avatar.tobi.sh/${await md5(input.slug)}.svg?text=🎭`,
    //     owner: { connect: { id: session!.userId } },
    //     members: { connect: { id: session!.userId } },
    //     moderators: { connect: { id: session!.userId } }
    //   }
    // })

    return Result.SUCCESS
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error)
  }
}

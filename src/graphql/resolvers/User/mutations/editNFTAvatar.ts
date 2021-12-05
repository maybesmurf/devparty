import { EditNftAvatarInput } from '@graphql/types.generated'
import { Prisma, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Edit user's NFT avatar
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditNFTAvatarInput
 * @param session - Current user's session
 * @returns the user
 */
export const editNFTAvatar = async (
  query: Record<string, unknown>,
  input: EditNftAvatarInput,
  session: Session | null | undefined
) => {
  try {
    return await db.user.update({
      ...query,
      where: { id: session!.userId },
      data: {
        profile: {
          update: { avatar: input.avatar, nftSource: input.nftSource }
        }
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

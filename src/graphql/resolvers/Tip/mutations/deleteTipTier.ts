import { Result } from '@graphql/resolvers/ResultResolver'
import { DeleteTipTierInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Delete a tip tier
 * @param input - DeleteTipTierInput
 * @param session - Current user's session
 * @returns the RESULT
 */
export const deleteTipTier = async (
  input: DeleteTipTierInput,
  session: Session | null | undefined
) => {
  const tip = await db.tip.findUnique({
    where: { userId: session?.userId }
  })

  if (tip?.userId !== session?.userId) {
    throw new Error("You don't have permission to delete others tip tier!")
  }

  try {
    await db.tipTier.delete({ where: { id: input?.id } })

    return Result.SUCCESS
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

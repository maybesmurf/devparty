import { AddTipTierInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Add new tip tier
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - AddTipTierInput
 * @param session - Current user's session
 * @returns the new tier
 */
export const addTipTier = async (
  query: Record<string, unknown>,
  input: AddTipTierInput,
  session: Session | null | undefined
) => {
  try {
    const tip = await db.tip.findUnique({
      where: { userId: session?.userId },
      select: { id: true }
    })

    return await db.tipTier.create({
      ...query,
      data: {
        name: input.name,
        description: input.description,
        amount: input.amount,
        tip: { connect: { id: tip?.id } }
      }
    })
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

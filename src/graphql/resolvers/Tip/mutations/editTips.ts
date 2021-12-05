import { EditTipsInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Edit Tips
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditTipsInput
 * @param session - Current user's session
 * @returns tips
 */
export const editTips = async (
  query: Record<string, unknown>,
  input: EditTipsInput,
  session: Session | null | undefined
) => {
  const data = {
    cash: input.cash,
    paypal: input.paypal,
    github: input.github,
    buymeacoffee: input.buymeacoffee,
    bitcoin: input.bitcoin,
    ethereum: input.ethereum
  }

  try {
    return await db.tip.upsert({
      ...query,
      where: { userId: session!.userId },
      update: data,
      create: {
        ...data,
        user: { connect: { id: session!.userId } }
      }
    })
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

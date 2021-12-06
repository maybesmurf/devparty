import { TipUserInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { utils } from 'ethers'
import { ERROR_MESSAGE, IS_PRODUCTION, SIGNING_MESSAGE } from 'src/constants'

/**
 * Tip a user
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - TipUserInput
 * @param session - Current user's session
 * @returns tipping
 */
export const tipUser = async (
  query: Record<string, unknown>,
  input: TipUserInput,
  session: Session | null | undefined
) => {
  if (input.userId === session?.userId) {
    throw new Error("You can't tip yourself!")
  }

  const address = utils
    .verifyMessage(`${SIGNING_MESSAGE} ${input.nonce}`, input.signature)
    .toString()
    .toLowerCase()

  if (address.toLowerCase() !== input.dispatcherAddress.toLowerCase()) {
    throw new Error('Address mismatch')
  }

  try {
    return await db.tipping.create({
      ...query,
      data: {
        txHash: input.txHash,
        dispatcherAddress: input.dispatcherAddress,
        receiverAddress: input.receiverAddress,
        tier: { connect: { id: input.tierId } },
        receiver: { connect: { id: input.userId } },
        dispatcher: { connect: { id: session?.userId } }
      }
    })
  } catch (error: any) {
    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

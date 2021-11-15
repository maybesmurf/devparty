import { Result } from '@graphql/resolvers/ResultResolver'
import { DeleteProductInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Delete the product
 * @param input - DeleteProductInput
 * @param session - Current user's session
 * @returns the result
 */
export const deleteProduct = async (
  input: DeleteProductInput,
  session: Session | null | undefined
) => {
  const product = await db.product.findUnique({
    where: { id: input.id },
    select: { id: true, owner: { select: { id: true } } }
  })

  if (product?.owner?.id !== session?.userId)
    throw new Error("You can't delete others product")

  await db.product.delete({
    where: { id: product?.id }
  })

  return Result.SUCCESS
}

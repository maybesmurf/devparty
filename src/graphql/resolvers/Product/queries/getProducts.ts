import { WhereProductsInput } from '../../../../__generated__/schema.generated'
import { prisma } from '../../../../utils/prisma'

export const getProducts = async (
  query: any,
  where: WhereProductsInput | null | undefined
) => {
  return await prisma.product.findMany({
    ...query,
    where: {
      user: {
        id: where?.userId as string
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

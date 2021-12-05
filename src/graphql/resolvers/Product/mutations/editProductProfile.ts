import { EditProductProfileInput } from '@graphql/types.generated'
import { Prisma } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION, RESERVED_SLUGS } from 'src/constants'

/**
 * Edit the product profile
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditProductProfileInput
 * @param session - Current user's session
 * @returns the edited product
 */
export const editProductProfile = async (
  query: Record<string, unknown>,
  input: EditProductProfileInput
) => {
  if (RESERVED_SLUGS.includes(input.slug)) {
    throw new Error(`Product slug "${input.slug}" is reserved by Devparty.`)
  }

  try {
    return await db.product.update({
      ...query,
      where: { id: input?.id },
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        avatar: input.avatar
      }
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new Error('Product slug is already taken!')
      }

      throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
    }
  }
}

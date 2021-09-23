import { db } from '@utils/prisma'

import { hasSubscribed } from '../queries/hasSubscribed'

export const toggleSubscribe = async (
  currentUserId: string,
  productId: string
) => {
  try {
    // Unstar
    if (await hasSubscribed(currentUserId, productId)) {
      return await db.product.update({
        where: { id: productId },
        data: {
          subscribers: {
            disconnect: {
              id: currentUserId
            }
          }
        }
      })
    }

    // Star
    const product = await db.product.update({
      where: { id: productId },
      data: {
        subscribers: {
          connect: {
            id: currentUserId
          }
        }
      }
    })

    return product
  } catch (error) {
    throw new Error('Something went wrong!')
  }
}

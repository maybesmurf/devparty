import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { EditPostInput } from 'src/__generated__/schema.generated'

/**
 * Edit the existing post
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditPostInput
 * @param session - Current user's session
 * @returns a edited post
 */
export const editPost = async (
  query: any,
  input: EditPostInput | null | undefined,
  session: Session | null | undefined
) => {
  const post = await db.post.findFirst({
    ...query,
    where: {
      id: input?.id,
      userId: session!.userId
    },

    rejectOnNotFound: true
  })

  return await db.post.update({
    where: { id: post?.id },
    data: { body: input?.body as string, done: input?.done as boolean }
  })
}

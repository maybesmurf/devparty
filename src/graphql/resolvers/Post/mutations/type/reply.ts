import { createNotification } from '@graphql/resolvers/Notification/mutations/createNotification'
import { getMentions } from '@graphql/utils/getMentions'
import { getTopics } from '@graphql/utils/getTopics'
import { parseTopics } from '@graphql/utils/parseTopics'
import { PostType, Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { CreatePostInput } from 'src/__generated__/schema.generated'

import { processMentions } from '../processMentions'

/**
 * Creates a new reply
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - CreatePostInput
 * @param session - Current user's session
 * @param parentId - Parent Post ID
 * @returns a new reply
 */
export const reply = async (
  query: any,
  input: CreatePostInput,
  session: Session | null | undefined,
  parentId: string | null | undefined
) => {
  const reply = await db.post.create({
    ...query,
    data: {
      userId: session!.userId,
      title: input.title,
      body: input.body,
      done: input.done,
      // TODO: work on this to new model
      attachments: input.attachments ? input.attachments : undefined,
      type: input.type as PostType,
      topics: { create: parseTopics(getTopics(input.body)) },
      parentId
    }
  })

  const parent = await db.post.findUnique({
    where: { id: reply?.parentId! }
  })

  if (getMentions(reply.body)?.length > 0) {
    await processMentions(reply, session)
  }

  if (session!.userId !== parent?.userId) {
    createNotification(session!.userId, parent?.userId, reply?.id, 'POST_REPLY')
  }

  return reply
}

import { getMentions } from '@graphql/utils/getMentions'
import { getTopics } from '@graphql/utils/getTopics'
import { parseAttachments } from '@graphql/utils/parseAttachments'
import { parseTopics } from '@graphql/utils/parseTopics'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { CreatePostInput } from 'src/__generated__/schema.generated'

import { processMentions } from '../processMentions'

/**
 * Creates a new post
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - CreatePostInput
 * @param session - Current user's session
 * @returns a new post
 */
export const post = async (
  query: any,
  input: CreatePostInput,
  session: Session | null | undefined
) => {
  const attachments = parseAttachments(input.attachments)
  console.log(attachments)
  const post = await db.post.create({
    ...query,
    data: {
      userId: session!.userId,
      body: input.body,
      attachments: {
        createMany: { data: attachments }
      },
      type: 'POST',
      productId:
        input.targetId && input.targetType === 'Product'
          ? input.targetId
          : null,
      communityId:
        input.targetId && input.targetType === 'Community'
          ? input.targetId
          : null,
      topics: { create: parseTopics(getTopics(input.body)) }
    }
  })

  if (getMentions(post.body)?.length > 0) {
    await processMentions(post, session)
  }

  return post
}

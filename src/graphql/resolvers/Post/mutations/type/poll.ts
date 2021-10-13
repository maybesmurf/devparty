import { getMentions } from '@graphql/utils/getMentions'
import { getTopics } from '@graphql/utils/getTopics'
import { parseTopics } from '@graphql/utils/parseTopics'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { CreatePostInput } from 'src/__generated__/schema.generated'

import { processMentions } from '../processMentions'

/**
 * Creates a new poll
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - CreatePostInput
 * @param session - Current user's session
 * @returns a new poll
 */
export const poll = async (
  query: any,
  input: CreatePostInput,
  session: Session | null | undefined
) => {
  const answers = JSON.parse(input.polls as string)
  var answersWithIndex = answers.map((el: any, index: number) => {
    var o = Object.assign({}, el)
    o.index = index
    return o
  })

  const poll = await db.post.create({
    ...query,
    data: {
      userId: session!.userId,
      body: input.body,
      type: 'POLL',
      productId: input.productId ? input.productId : null,
      topics: { create: parseTopics(getTopics(input.body)) },
      poll: { create: { answers: { createMany: { data: answersWithIndex } } } }
    }
  })

  if (getMentions(poll.body)?.length > 0) {
    await processMentions(poll, session)
  }

  return poll
}

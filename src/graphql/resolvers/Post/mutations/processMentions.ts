import { getMentions } from '@graphql/utils/getMentions'
import { parseMentions } from '@graphql/utils/parseMentions'
import { Post, Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Process and creates mentions
 * @param post - Post to process mentions
 * @param session - Current user's session
 */
export const processMentions = async (
  post: Post,
  session: Session | undefined | null
) => {
  const users = await parseMentions(getMentions(post?.body), session, post)
  const mentions = users.filter(function (obj) {
    return obj.receiverId !== session?.userId
  })

  await db.notification.createMany({
    data: mentions,
    skipDuplicates: true
  })
}

import { NotificationType, Post, Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Generated the prisma compatible parsed data to inserted
 * @param mentions - Array of mentions generated in getMentions()
 * @param session - Current user session
 * @param post - Post
 * @returns prisma compatible parsed data to inserted
 */
export const parseMentions = async (
  mentions: string[],
  session: Session | undefined | null,
  post: Post
) => {
  if (mentions) {
    const users = await db.user.findMany({
      where: { username: { in: mentions } },
      select: { id: true }
    })

    return users.map((user) => ({
      dispatcherId: session?.userId as string,
      receiverId: user?.id,
      postId: post?.id,
      entityId: post?.id,
      type: 'USER_MENTION' as NotificationType
    }))
  } else {
    return []
  }
}

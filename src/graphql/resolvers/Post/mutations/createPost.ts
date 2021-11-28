import { CreatePostInput } from '@graphql/types.generated'
import { getMentions } from '@graphql/utils/getMentions'
import { getTopics } from '@graphql/utils/getTopics'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

import { storeToIPFS } from './storeToIPFS'
import { issue } from './type/issue'
import { poll } from './type/poll'
import { post } from './type/post'
import { question } from './type/question'
import { reply } from './type/reply'
import { task } from './type/task'

/**
 * Creates a new post
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - CreatePostInput
 * @param session - Current user's session
 * @returns the new post
 */
export const createPost = async (
  query: Record<string, unknown>,
  input: CreatePostInput,
  session: Session | null | undefined
) => {
  if (getTopics(input.body)?.length > 5) {
    throw new Error('Oops! Your post should not contain more than 5 topics')
  }

  if (getMentions(input.body)?.length > 5) {
    throw new Error('Oops! Your post should not contain more than 5 mentions')
  }

  if (input.parentId && input.type !== 'REPLY') {
    throw new Error('Invalid type')
  }

  if (input.targetId && input.targetType === 'Product') {
    const product = await db.product.findUnique({
      ...query,
      where: { id: input.targetId }
    })

    if (product?.ownerId !== session!.userId) {
      throw new Error(
        'Oops! Sorry you cannot post in product that is not owned'
      )
    }
  }

  if (input.targetId && input.targetType === 'Community') {
    const community = await db.community.findUnique({
      ...query,
      where: { id: input.targetId }
    })

    if (community?.ownerId !== session!.userId) {
      throw new Error(
        'Oops! Sorry you cannot post in community that is not owned'
      )
    }
  }

  let parentId = null

  if (input.parentId) {
    const parent = await db.post.findUnique({
      ...query,
      where: { id: input.parentId }
    })
    if (parent) {
      parentId = parent?.id
    } else {
      throw new Error('Incorrect parent ID')
    }
  }

  let newPost: any

  if (input?.type === 'POST') {
    newPost = await post(query, input, session)
  }

  if (input?.type === 'TASK') {
    newPost = await task(query, input, session)
  }

  if (input?.type === 'QUESTION') {
    newPost = await question(query, input, session)
  }

  if (input?.type === 'POLL') {
    newPost = await poll(query, input, session)
  }

  if (input?.type === 'ISSUE') {
    newPost = await issue(query, input, session)
  }

  if (input?.type === 'REPLY') {
    newPost = await reply(query, input, session, parentId)
  }

  storeToIPFS(newPost)

  return newPost
}

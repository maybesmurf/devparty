import { EditStatusInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

/**
 * Edit user's profile status
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - EditStatusInput
 * @param session - Current user's session
 * @returns the edited status
 */
export const editStatus = async (
  query: Record<string, unknown>,
  input: EditStatusInput,
  session: Session | null | undefined
) => {
  const data = {
    emoji: input.emoji,
    text: input.text
  }

  try {
    return await db.status.upsert({
      ...query,
      where: { userId: session!.userId },
      update: data,
      create: {
        ...data,
        user: { connect: { id: session!.userId } }
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta.target === 'users_username_key') {
      throw new Error('Username is already taken!')
    }

    if (error.code === 'P2002' && error.meta.target === 'users_email_key') {
      throw new Error('Email is already taken!')
    }

    throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
  }
}

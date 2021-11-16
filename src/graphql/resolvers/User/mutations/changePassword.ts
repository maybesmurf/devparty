import { createLog } from '@graphql/resolvers/Log/mutations/createLog'
import { Result } from '@graphql/resolvers/ResultResolver'
import { ChangePasswordInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { hashPassword, verifyPassword } from '@utils/auth'
import { db } from '@utils/prisma'

/**
 * Change a user's password
 * @param input - ChangePasswordInput
 * @param session - Current user's session
 * @returns a Result (Success/Failed)
 */
export const changePassword = async (
  input: ChangePasswordInput,
  session: Session | null | undefined
) => {
  const user = await db.user.findUnique({ where: { id: session!.userId } })

  const passwordValid = await verifyPassword(
    user?.hashedPassword as string,
    input.currentPassword
  )

  if (!passwordValid) {
    throw new Error('Current password was not correct.')
  }

  await db.user.update({
    where: { id: user!.id },
    data: {
      hashedPassword: await hashPassword(input.newPassword),
      sessions: {
        deleteMany: {
          id: {
            not: session!.id
          }
        }
      }
    }
  })
  createLog(session!.userId, user?.id as string, 'PASSWORD_UPDATE')

  // Logout everywhere
  await db.session.deleteMany({
    where: { userId: user!.id }
  })

  return Result.SUCCESS
}

import { EditIntegrationInput } from '@graphql/types.generated'
import getENS from '@lib/getENS'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Edit the user's integration
 * @param input - EditIntegrationInput
 * @param session - Current user session
 * @returns updated integration
 */
export const editIntegration = async (
  query: Record<string, unknown>,
  input: EditIntegrationInput,
  session: Session | null | undefined
) => {
  const data = {
    wakatimeAPIKey: input.wakatimeAPIKey,
    spotifyRefreshToken: input.spotifyRefreshToken,
    ethAddress: input.ethAddress,
    ensAddress: input.ethAddress
      ? await getENS(input.ethAddress as string)
      : null
  }

  return await db.integration.upsert({
    ...query,
    where: { userId: session!.userId },
    update: data,
    create: {
      ...data,
      user: { connect: { id: session!.userId } }
    }
  })
}

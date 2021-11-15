import { MintNftInput } from '@graphql/types.generated'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'

/**
 * Mint an NFT
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param input - MintNftInput
 * @returns a nft address and token
 * @param session - Current user's session
 */
export const mintNFT = async (
  query: Record<string, unknown>,
  input: MintNftInput | null | undefined,
  session: Session | null | undefined
) => {
  const post = await db.post.findFirst({
    ...query,
    where: {
      id: input?.postId,
      userId: session!.userId
    },

    rejectOnNotFound: true
  })

  if (post?.userId !== session?.userId) {
    throw new Error("You can't ming other users post!")
  }

  const nftData = {
    address: input?.address as string,
    tokenId: input?.tokenId as string,
    network: input?.network as string
  }

  return await db.nFT.upsert({
    where: { postId: post?.id },
    update: nftData,
    create: { post: { connect: { id: post?.id } }, ...nftData }
  })
}

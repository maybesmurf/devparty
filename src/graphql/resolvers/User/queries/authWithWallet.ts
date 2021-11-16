import { getRandomCover } from '@graphql/utils/getRandomCover'
import { db } from '@utils/prisma'
import { ethers } from 'ethers'
import { md5 } from 'hash-wasm'
import { PUBLIC_SIGNING_MESSAGE } from 'src/constants'

/**
 * Authenticate a user with Wallet
 * @param query - Contains an include object to pre-load data needed to resolve nested parts.
 * @param nonce - Unique nonce generated on sign request
 * @param signature - Generated from wallet
 * @returns the authenticated user
 */
export const authWithWallet = async (
  query: any,
  nonce: string,
  signature: string
) => {
  const address = ethers.utils.verifyMessage(
    `${PUBLIC_SIGNING_MESSAGE} ${nonce}`,
    signature
  )

  const user = await db.user.findFirst({
    ...query,
    where: { integrations: { ethAddress: address } }
  })

  if (user) {
    return user
  } else {
    return await db.user.create({
      ...query,
      data: {
        username: address,
        inWaitlist: false,
        profile: {
          create: {
            name: address,
            avatar: `https://avatar.tobi.sh/${await md5(address)}.svg`,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color
          }
        },
        integrations: {
          create: {
            ethAddress: address,
            ethNonce: nonce
          }
        }
      }
    })
  }
}

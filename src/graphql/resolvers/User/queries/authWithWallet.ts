// @ts-ignore
import { getRandomCover } from '@graphql/utils/getRandomCover'
import { formatUsername } from '@lib/formatUsername'
import { db } from '@utils/prisma'
import { ethers } from 'ethers'
import { md5 } from 'hash-wasm'
import { AUTH_SIGNING_MESSAGE } from 'src/constants'
import getENS from 'src/lib/getENS'

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
  const address = ethers.utils
    .verifyMessage(`${AUTH_SIGNING_MESSAGE} ${nonce}`, signature)
    .toString()
    .toLowerCase()
  const user = await db.user.findFirst({
    ...query,
    where: { integrations: { ethAddress: address } }
  })
  const ens = await getENS(address)

  if (user) {
    return await db.user.update({
      where: { id: user?.id },
      data: { integrations: { update: { ensAddress: ens } } }
    })
  } else {
    return await db.user.create({
      ...query,
      data: {
        username: ens,
        inWaitlist: false,
        profile: {
          create: {
            name: formatUsername(ens),
            avatar: `https://avatar.tobi.sh/${await md5(ens)}.svg`,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color
          }
        },
        integrations: {
          create: {
            ethAddress: address,
            ensAddress: ens,
            ethNonce: nonce
          }
        }
      }
    })
  }
}

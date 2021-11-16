import { db } from '@utils/prisma'
import { ethers } from 'ethers'
import { IS_PRODUCTION, PUBLIC_SIGNING_MESSAGE } from 'src/constants'

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

  let ens
  try {
    const response = await fetch(
      `https://api.thegraph.com/subgraphs/name/ensdomains/${
        IS_PRODUCTION ? 'ensrinkeby' : 'ensrinkeby'
      }`,
      {
        body: JSON.stringify({
          operationName: 'getNamesFromSubgraph',
          query: `
            query getNamesFromSubgraph($address: String!) {
              domains(first: 1, where: {resolvedAddress: $address}) {
                name
              }
            }
          `,
          variables: { address: address.toString().toLowerCase() }
        }),
        method: 'POST'
      }
    )
    const result = await response.json()
    ens = result?.data?.domains[0]?.name
  } catch {
    ens = address
  }

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

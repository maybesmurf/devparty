import { formatUsername } from '@components/utils/formatUsername'
import { getRandomCover } from '@graphql/utils/getRandomCover'
import { db } from '@utils/prisma'
import { ethers } from 'ethers'
import { md5 } from 'hash-wasm'
import { AUTH_SIGNING_MESSAGE, IS_PRODUCTION } from 'src/constants'

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

  let ens
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
        variables: { address }
      }),
      method: 'POST'
    }
  )
  const result = await response.json()
  const domains = result?.data?.domains
  if (domains.length > 0) {
    ens = result?.data?.domains[0]?.name
  } else {
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

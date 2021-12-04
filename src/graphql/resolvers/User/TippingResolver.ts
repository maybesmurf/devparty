import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'
import { utils } from 'ethers'
import { SIGNING_MESSAGE } from 'src/constants'

builder.prismaObject('Tipping', {
  findUnique: (tipping) => ({ id: tipping.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    dispatcherAddress: t.exposeString('dispatcherAddress'),
    receiverAddress: t.exposeString('receiverAddress'),
    txHash: t.exposeString('txHash'),

    // Relations
    tier: t.relation('tier'),
    receiver: t.relation('receiver'),
    dispatcher: t.relation('dispatcher')
  })
})

const TipUserInput = builder.inputType('TipUserInput', {
  fields: (t) => ({
    signature: t.string(),
    nonce: t.string(),
    dispatcherAddress: t.string(),
    receiverAddress: t.string(),
    txHash: t.string(),
    tierId: t.id({ validate: { uuid: true } }),
    userId: t.id({ validate: { uuid: true } })
  })
})

// TODO: Split to function
builder.mutationField('tipUser', (t) =>
  t.prismaField({
    type: 'Tipping',
    args: { input: t.arg({ type: TipUserInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      const address = utils
        .verifyMessage(`${SIGNING_MESSAGE} ${input.nonce}`, input.signature)
        .toString()
        .toLowerCase()

      return await db.tipping.create({
        ...query,
        data: {
          dispatcherAddress: input.dispatcherAddress,
          txHash: input.txHash,
          receiverAddress: input.receiverAddress,
          tier: { connect: { id: input.tierId } },
          receiver: { connect: { id: input.userId } },
          dispatcher: { connect: { id: session?.userId } }
        }
      })
    }
  })
)

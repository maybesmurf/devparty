import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

builder.prismaObject('Tipping', {
  findUnique: (tipping) => ({ id: tipping.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    txHash: t.exposeString('txHash'),

    // Relations
    tier: t.relation('tier'),
    receiver: t.relation('receiver'),
    dispatcher: t.relation('dispatcher')
  })
})

const CreateTippingInput = builder.inputType('CreateTippingInput', {
  fields: (t) => ({
    txHash: t.string(),
    tierId: t.id({ validate: { uuid: true } }),
    userId: t.id({ validate: { uuid: true } })
  })
})

// TODO: Split to function
builder.mutationField('createTipping', (t) =>
  t.prismaField({
    type: 'Tipping',
    args: { input: t.arg({ type: CreateTippingInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await db.tipping.create({
        ...query,
        data: {
          txHash: input.txHash,
          tier: { connect: { id: input.tierId } },
          receiver: { connect: { id: input.userId } },
          dispatcher: { connect: { id: session?.userId } }
        }
      })
    }
  })
)

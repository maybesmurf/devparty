import { builder } from '@graphql/builder'

builder.prismaObject('Tipping', {
  findUnique: (tipping) => ({ id: tipping.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    txHash: t.exposeString('txHash'),

    // Relations
    tier: t.relation('tipTier'),
    receiver: t.relation('receiver'),
    dispatcher: t.relation('dispatcher')
  })
})

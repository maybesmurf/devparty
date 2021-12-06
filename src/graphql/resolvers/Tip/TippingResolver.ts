import { builder } from '@graphql/builder'

import { tipUser } from './mutations/tipUser'

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
    amount: t.int(),
    tierId: t.id({ validate: { uuid: true } }),
    userId: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('tipUser', (t) =>
  t.prismaField({
    type: 'Tipping',
    args: { input: t.arg({ type: TipUserInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await tipUser(query, input, session)
    }
  })
)

import { builder } from '@graphql/builder'

import { Result } from '../ResultResolver'
import { addTipTier } from './mutations/addTipTier'
import { deleteTipTier } from './mutations/deleteTipTier'

builder.prismaObject('TipTier', {
  findUnique: (tip_tier) => ({ id: tip_tier.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    amount: t.exposeInt('amount'),
    name: t.exposeString('name'),
    description: t.exposeString('description'),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    // Relations
    tip: t.relation('tip')
  })
})

const AddTipTierInput = builder.inputType('AddTipTierInput', {
  fields: (t) => ({
    name: t.string(),
    description: t.string(),
    amount: t.int()
  })
})

builder.mutationField('addTipTier', (t) =>
  t.prismaField({
    type: 'TipTier',
    args: { input: t.arg({ type: AddTipTierInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await addTipTier(query, input, session)
    }
  })
)

const DeleteTipTierInput = builder.inputType('DeleteTipTierInput', {
  fields: (t) => ({ id: t.string() })
})

builder.mutationField('deleteTipTier', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: DeleteTipTierInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }, { session }) => {
      return await deleteTipTier(input, session)
    }
  })
)

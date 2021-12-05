import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { Result } from '../ResultResolver'
import { addTipTier } from './mutations/addTipTier'

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
  fields: (t) => ({
    id: t.string()
  })
})

// TODO: Split to function
builder.mutationField('deleteTipTier', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: DeleteTipTierInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }, { session }) => {
      const tip = await db.tip.findUnique({
        where: { userId: session?.userId }
      })

      if (tip?.userId !== session?.userId) {
        throw new Error("You don't have permission to delete others tip tier!")
      }

      await db.tipTier.delete({ where: { id: input?.id } })

      return Result.SUCCESS
    }
  })
)

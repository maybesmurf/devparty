import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { Result } from '../ResultResolver'

builder.prismaObject('TipTier', {
  findUnique: (tip_tier) => ({ id: tip_tier.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    amount: t.exposeInt('amount'),
    description: t.exposeString('description', { nullable: true }),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    // Relations
    tip: t.relation('tip')
  })
})

const AddTipTierInput = builder.inputType('AddTipTierInput', {
  fields: (t) => ({
    description: t.string(),
    amount: t.int()
  })
})

// TODO: Split to function
builder.mutationField('addTipTier', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: AddTipTierInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }, { session }) => {
      await db.tip.update({
        where: { userId: session?.userId },
        data: {
          tiers: {
            create: {
              description: input.description,
              amount: input.amount
            }
          }
        }
      })

      return Result.SUCCESS
    }
  })
)

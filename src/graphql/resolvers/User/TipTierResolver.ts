import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

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
    type: 'TipTier',
    args: { input: t.arg({ type: AddTipTierInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }, { session }) => {
      const tip = await db.tip.findUnique({
        where: { userId: session?.userId },
        select: { id: true }
      })

      return await db.tipTier.create({
        data: {
          description: input.description,
          amount: input.amount,
          tip: { connect: { id: tip?.id } }
        }
      })
    }
  })
)

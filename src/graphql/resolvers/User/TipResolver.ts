import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

builder.prismaObject('Tip', {
  findUnique: (tip) => ({ id: tip.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    cash: t.exposeString('cash', { nullable: true }),
    paypal: t.exposeString('paypal', { nullable: true }),
    github: t.exposeString('github', { nullable: true }),
    buymeacoffee: t.exposeString('buymeacoffee', { nullable: true }),
    bitcoin: t.exposeString('bitcoin', { nullable: true }),
    ethereum: t.exposeString('ethereum', { nullable: true }),

    // Relations
    user: t.relation('user'),
    tiers: t.relatedConnection('tiers', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        orderBy: { createdAt: 'desc' }
      })
    })
  })
})

const EditTipsInput = builder.inputType('EditTipsInput', {
  fields: (t) => ({
    cash: t.string({ required: false, validate: { maxLength: 50 } }),
    paypal: t.string({ required: false, validate: { maxLength: 50 } }),
    github: t.string({ required: false, validate: { maxLength: 50 } }),
    buymeacoffee: t.string({ required: false, validate: { maxLength: 50 } }),
    bitcoin: t.string({ required: false, validate: { maxLength: 50 } }),
    ethereum: t.string({ required: false, validate: { maxLength: 50 } })
  })
})

// TODO: Split to function
builder.mutationField('editTips', (t) =>
  t.prismaField({
    type: 'Tip',
    args: { input: t.arg({ type: EditTipsInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      const data = {
        cash: input.cash,
        paypal: input.paypal,
        github: input.github,
        buymeacoffee: input.buymeacoffee,
        bitcoin: input.bitcoin,
        ethereum: input.ethereum
      }

      return await db.tip.upsert({
        ...query,
        where: { userId: session!.userId },
        update: data,
        create: {
          ...data,
          user: { connect: { id: session!.userId } }
        }
      })
    }
  })
)

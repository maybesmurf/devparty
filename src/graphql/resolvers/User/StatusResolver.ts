import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { Result } from '../ResultResolver'
import { editStatus } from './mutations/editStatus'

builder.prismaObject('Status', {
  findUnique: (status) => ({ id: status.id }),
  fields: (t) => ({
    emoji: t.exposeString('emoji'),
    text: t.exposeString('text'),

    // Relations
    user: t.relation('user')
  })
})

const EditStatusInput = builder.inputType('EditStatusInput', {
  fields: (t) => ({
    emoji: t.string({ validate: { maxLength: 50 } }),
    text: t.string({ validate: { maxLength: 50 } })
  })
})

builder.mutationField('editStatus', (t) =>
  t.prismaField({
    type: 'Status',
    args: { input: t.arg({ type: EditStatusInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await editStatus(query, input, session)
    }
  })
)

builder.mutationField('clearStatus', (t) =>
  t.field({
    type: Result,
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, args, { session }) => {
      await db.status.deleteMany({ where: { userId: session!.userId } })

      return Result.SUCCESS
    }
  })
)

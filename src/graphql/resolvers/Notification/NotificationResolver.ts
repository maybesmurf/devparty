import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { Result } from '../ResultResolver'
import { getNotifications } from './queries/getNotifications'

builder.prismaObject('Notification', {
  findUnique: (post) => ({ id: post.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.exposeString('type'),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Relations
    receiver: t.relation('receiver'),
    dispatcher: t.relation('dispatcher'),
    post: t.relation('post', { nullable: true }),
    like: t.relation('like', { nullable: true }),
    product: t.relation('product', { nullable: true })
  })
})

builder.queryField('notifications', (t) =>
  t.prismaConnection({
    type: 'Notification',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    args: { isRead: t.arg.boolean({ defaultValue: false }) },
    authScopes: { user: true },
    resolve: async (query, parent, { isRead }, { session }) => {
      return await getNotifications(query, isRead, session)
    }
  })
)

const ReadNotificationInput = builder.inputType('ReadNotificationInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('readNotification', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: ReadNotificationInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (parent, { input }) => {
      await db.notification.update({
        where: { id: input!.id },
        data: { isRead: true }
      })

      return Result.SUCCESS
    }
  })
)

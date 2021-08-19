import { db } from '../../../utils/prisma'
import { builder } from '../../builder'
import { getNotifications } from './queries/getNotifications'

builder.prismaObject(db.notification, {
  findUnique: (post) => ({ id: post.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    message: t.exposeString('message'),
    type: t.exposeString('type'),
    receiver: t.relation('receiver'),
    dispatcher: t.relation('dispatcher')
  })
})

builder.queryField('notifications', (t) =>
  t.prismaConnection({
    type: db.notification,
    cursor: 'id',
    resolve: async (query, root, args, { session }) => {
      return await getNotifications(query, session)
    }
  })
)

import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

builder.queryField('searchTopics', (t) =>
  t.prismaConnection({
    type: 'Topic',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    args: { keyword: t.arg.string() },
    resolve: async (query, parent, { keyword }) => {
      return await db.topic.findMany({
        ...query,
        where: { name: { contains: keyword } }
      })
    }
  })
)

builder.queryField('searchUsers', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    args: { keyword: t.arg.string() },
    resolve: async (query, parent, { keyword }) => {
      return await db.user.findMany({
        ...query,
        where: {
          OR: [
            { username: { contains: keyword }, inWaitlist: false },
            { profile: { name: { contains: keyword } } }
          ]
        }
      })
    }
  })
)

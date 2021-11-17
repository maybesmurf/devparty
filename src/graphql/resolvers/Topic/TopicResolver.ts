import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'
import { BASE_URL } from 'src/constants'

import { modTopic } from './mutations/modTopic'
import { toggleStar } from './mutations/toggleStar'
import { getFeaturedTopics } from './queries/getFeaturedTopics'
import { hasStarred } from './queries/hasStarred'

builder.prismaObject('Topic', {
  findUnique: (topic) => ({ id: topic.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    image: t.exposeString('image', { nullable: true }),
    description: t.exposeString('description', { nullable: true }),
    hasStarred: t.field({
      type: 'Boolean',
      resolve: async (parent, args, { session }) => {
        if (!session) return false
        return await hasStarred(session?.userId as string, parent.id)
      }
    }),
    postsCount: t.relationCount('posts'),
    htmlUrl: t.field({
      type: 'String',
      resolve: (parent) => {
        return `${BASE_URL}/topics/${parent?.name}`
      }
    }),

    // Timestamps
    featuredAt: t.expose('featuredAt', { type: 'DateTime', nullable: true }),

    // Relations
    starrers: t.relatedConnection('starrers', {
      cursor: 'id',
      totalCount: true
    }),
    posts: t.prismaConnection({
      type: 'Post',
      cursor: 'id',
      defaultSize: 20,
      maxSize: 100,
      resolve: (query, parent) =>
        db.post.findMany({
          ...query,
          where: {
            topics: { some: { topic: { name: parent.name } } },
            hidden: false
          },
          orderBy: { createdAt: 'desc' }
        })
    })
  })
})

builder.queryField('topic', (t) =>
  t.prismaField({
    type: 'Topic',
    args: { name: t.arg.string() },
    resolve: async (query, parent, { name }) => {
      return await db.topic.findUnique({
        ...query,
        where: { name },
        rejectOnNotFound: true
      })
    }
  })
)

builder.queryField('featuredTopics', (t) =>
  t.prismaConnection({
    type: 'Topic',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    resolve: async (query) => {
      return await getFeaturedTopics(query)
    }
  })
)

const ToggleTopicStarInput = builder.inputType('ToggleTopicStarInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('toggleTopicStar', (t) =>
  t.prismaField({
    type: 'Topic',
    args: { input: t.arg({ type: ToggleTopicStarInput }) },
    nullable: true,
    authScopes: { user: true },
    resolve: async (query, parent, { input }, { session }) => {
      return await toggleStar(session?.userId as string, input.id)
    }
  })
)

const ModTopicInput = builder.inputType('ModTopicInput', {
  fields: (t) => ({
    id: t.id(),
    description: t.string({ required: false }),
    featuredAt: t.boolean({ required: false })
  })
})

builder.mutationField('modTopic', (t) =>
  t.prismaField({
    type: 'Topic',
    args: { input: t.arg({ type: ModTopicInput }) },
    nullable: true,
    authScopes: { staff: true },
    resolve: async (query, parent, { input }, { session }) => {
      return await modTopic(query, input, session)
    }
  })
)

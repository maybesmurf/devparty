import { builder } from '@graphql/builder'

import { toggleBookmark } from './mutations/toggleBookmark'

builder.prismaObject('Bookmark', {
  findUnique: (bookmark) => ({ id: bookmark.id }),
  fields: (t) => ({
    id: t.exposeID('id'),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    // Relations
    user: t.relation('user'),
    post: t.relation('post')
  })
})

const ToggleBookmarkInput = builder.inputType('ToggleBookmarkInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('toggleBookmark', (t) =>
  t.prismaField({
    type: 'Post',
    args: { input: t.arg({ type: ToggleBookmarkInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      return await toggleBookmark(session?.userId as string, input.id)
    }
  })
)

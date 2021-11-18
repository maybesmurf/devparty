import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'
import { BASE_URL } from 'src/constants'

import { Result } from '../ResultResolver'
import { addCommunityModerator } from './mutations/addCommunityModerator'
import { createCommunity } from './mutations/createCommunity'
import { removeCommunityUser } from './mutations/removeCommunityUser'
import { toggleJoin } from './mutations/toggleJoin'
import { hasJoined } from './queries/hasJoined'

builder.prismaObject('Community', {
  findUnique: (community) => ({ id: community.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    slug: t.exposeString('slug'),
    description: t.exposeString('description', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    hasJoined: t.field({
      type: 'Boolean',
      resolve: async (parent, args, { session }) => {
        if (!session) return false
        return await hasJoined(session?.userId as string, parent.id)
      }
    }),
    htmlUrl: t.field({
      type: 'String',
      resolve: (parent) => {
        return `${BASE_URL}/communities/${parent?.slug}`
      }
    }),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    // Relations
    owner: t.relation('owner'),
    ownerId: t.exposeID('ownerId'),
    members: t.relatedConnection('members', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { spammy: false }
      })
    }),
    moderators: t.relatedConnection('moderators', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { spammy: false }
      })
    }),
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { hidden: false },
        orderBy: { createdAt: 'desc' }
      })
    }),
    rules: t.relatedConnection('rules', {
      cursor: 'id',
      query: () => ({ orderBy: { index: 'asc' } })
    })
  })
})

builder.queryField('community', (t) =>
  t.prismaField({
    type: 'Community',
    args: { slug: t.arg.string() },
    resolve: async (query, parent, { slug }) => {
      return await db.community.findFirst({
        ...query,
        where: { slug, hidden: false },
        rejectOnNotFound: true
      })
    }
  })
)

const CreateCommunityInput = builder.inputType('CreateCommunityInput', {
  fields: (t) => ({
    name: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    slug: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    description: t.string({ required: false, validate: { maxLength: 190 } })
  })
})

builder.mutationField('createCommunity', (t) =>
  t.prismaField({
    type: 'Community',
    args: { input: t.arg({ type: CreateCommunityInput }) },
    authScopes: { user: true },
    resolve: async (query, parent, { input }, { session }) => {
      return await createCommunity(query, input, session)
    }
  })
)

const ToggleCommunityJoinInput = builder.inputType('ToggleCommunityJoinInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('toggleCommunityJoin', (t) =>
  t.prismaField({
    type: 'Community',
    args: { input: t.arg({ type: ToggleCommunityJoinInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      return await toggleJoin(session?.userId as string, input.id)
    }
  })
)

const RemoveCommunityUserInput = builder.inputType('RemoveCommunityUserInput', {
  fields: (t) => ({
    userId: t.id({ validate: { uuid: true } }),
    communityId: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('removeCommunityUser', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: RemoveCommunityUserInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (parent, { input }, { session }) => {
      return await removeCommunityUser(input, session)
    }
  })
)

const AddCommunityModeratorInput = builder.inputType(
  'AddCommunityModeratorInput',
  {
    fields: (t) => ({
      userId: t.id({ validate: { uuid: true } }),
      communityId: t.id({ validate: { uuid: true } })
    })
  }
)

builder.mutationField('addCommunityModerator', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: AddCommunityModeratorInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (parent, { input }, { session }) => {
      return await addCommunityModerator(input, session)
    }
  })
)

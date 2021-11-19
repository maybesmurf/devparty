import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { Result } from '../ResultResolver'
import { getBadges } from './queries/getBadges'

builder.prismaObject('Badge', {
  findUnique: (badge) => ({ id: badge.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    description: t.exposeString('description', { nullable: true }),
    image: t.exposeString('image'),

    // Relations
    users: t.relatedConnection('users', { cursor: 'id', totalCount: true })
  })
})

builder.queryField('badges', (t) =>
  t.prismaConnection({
    type: 'Badge',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    authScopes: { staff: true },
    resolve: async (query) => {
      return await getBadges(query)
    }
  })
)

const CreateBadgeInput = builder.inputType('CreateBadgeInput', {
  fields: (t) => ({
    name: t.string(),
    image: t.string(),
    description: t.string()
  })
})

builder.mutationField('createBadge', (t) =>
  t.prismaField({
    type: 'Badge',
    args: { input: t.arg({ type: CreateBadgeInput }) },
    authScopes: { staff: true },
    resolve: async (query, parent, { input }) => {
      return await db.badge.create({
        ...query,
        data: {
          name: input.name,
          image: input.image,
          description: input.description
        }
      })
    }
  })
)

const AwardBadgeInput = builder.inputType('AwardBadgeInput', {
  fields: (t) => ({
    users: t.string()
  })
})

builder.mutationField('awardBadge', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: AwardBadgeInput }) },
    authScopes: { staff: true },
    resolve: async (parent, { input }) => {
      // await db.user.update({
      //   where: { id: input.userId },
      //   data: { badges: { connect: { id: input.badgeId } } }
      // })

      return Result.SUCCESS
    }
  })
)

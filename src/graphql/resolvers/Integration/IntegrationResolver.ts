import { builder } from '@graphql/builder'
import { db } from '@utils/prisma'

import { editIntegration } from './mutations/editIntegration'

builder.prismaObject('Integration', {
  findUnique: (integration) => ({ id: integration.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    wakatimeAPIKey: t.field({
      type: 'String',
      nullable: true,
      resolve: async (parent, args, { session }) => {
        if (!session || session.userId !== parent.userId) {
          return null
        }
        const integration = await db.integration.findUnique({
          where: { id: parent.id }
        })
        return integration?.wakatimeAPIKey
      }
    }),
    spotifyRefreshToken: t.field({
      type: 'String',
      nullable: true,
      resolve: async (parent, args, { session }) => {
        if (!session || session.userId !== parent.userId) {
          return null
        }
        const integration = await db.integration.findUnique({
          where: { id: parent.id }
        })
        return integration?.spotifyRefreshToken
      }
    }),
    githubId: t.exposeString('githubId', { nullable: true }),
    ethAddress: t.exposeString('ethAddress', { nullable: true }),
    ensAddress: t.exposeString('ensAddress', { nullable: true }),

    // Relations
    user: t.relation('user')
  })
})

builder.queryField('integration', (t) =>
  t.prismaField({
    type: 'Integration',
    args: { userId: t.arg.id({ required: false, validate: { uuid: true } }) },
    nullable: true,
    resolve: async (query, parent, { userId }, { session }) => {
      return await db.integration.findFirst({
        where: { userId: userId ? userId : session?.userId }
      })
    }
  })
)

const EditIntegrationInput = builder.inputType('EditIntegrationInput', {
  fields: (t) => ({
    ethAddress: t.string({ required: false }),
    wakatimeAPIKey: t.string({ required: false }),
    spotifyRefreshToken: t.string({ required: false })
  })
})

builder.mutationField('editIntegration', (t) =>
  t.prismaField({
    type: 'Integration',
    args: { input: t.arg({ type: EditIntegrationInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await editIntegration(query, input, session)
    }
  })
)

import { builder } from '@graphql/builder'

import { editProfileReadme } from './mutations/editProfileReadme'
import { editUserSocial } from './mutations/editUserSocial'
import { hasReadme } from './queries/hasReadme'

builder.prismaObject('Profile', {
  findUnique: (profile) => ({ id: profile.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    bio: t.exposeString('bio', { nullable: true }),
    location: t.exposeString('location', { nullable: true }),
    avatar: t.exposeString('avatar'),
    nftSource: t.exposeString('nftSource', { nullable: true }),
    cover: t.exposeString('cover'),
    coverBg: t.exposeString('coverBg'),
    readme: t.exposeString('readme', { nullable: true }),
    hasReadme: t.field({
      type: 'Boolean',
      resolve: async (parent) => {
        return await hasReadme(parent.userId)
      }
    }),

    // Social
    website: t.exposeString('website', { nullable: true }),
    twitter: t.exposeString('twitter', { nullable: true }),
    github: t.exposeString('github', { nullable: true }),
    discord: t.exposeString('discord', { nullable: true })
  })
})

const EditUserSocialInput = builder.inputType('EditUserSocialInput', {
  fields: (t) => ({
    website: t.string({
      required: false,
      validate: { maxLength: 100, url: true }
    }),
    twitter: t.string({ required: false, validate: { maxLength: 50 } }),
    github: t.string({ required: false, validate: { maxLength: 50 } }),
    discord: t.string({ required: false, validate: { maxLength: 50 } })
  })
})

builder.mutationField('editUserSocial', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: EditUserSocialInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await editUserSocial(query, input, session)
    }
  })
)

const EditProfileReadmeInput = builder.inputType('EditProfileReadmeInput', {
  fields: (t) => ({
    readme: t.string()
  })
})

builder.mutationField('editProfileReadme', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: EditProfileReadmeInput }) },
    authScopes: { user: true, $granted: 'currentUser' },
    resolve: async (query, parent, { input }, { session }) => {
      return await editProfileReadme(query, input, session)
    }
  })
)

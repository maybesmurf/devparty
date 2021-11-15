import { builder } from '@graphql/builder'
import { Prisma } from '@prisma/client'
import { db } from '@utils/prisma'
import { BASE_URL, ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import { createLog } from '../Log/mutations/createLog'
import { Result } from '../ResultResolver'
import { deleteAccount } from './mutations/deleteAccount'
import { modUser } from './mutations/modUser'
import { toggleFollow } from './mutations/toggleFollow'
import { getFeaturedUsers } from './queries/getFeaturedUsers'
import { getSuggestedUsers } from './queries/getSuggestedUsers'
import { getUsers } from './queries/getUsers'
import { getWhoToFollow } from './queries/getWhoToFollow'
import { hasFollowed } from './queries/hasFollowed'
import { isFollowing } from './queries/isFollowing'

builder.prismaObject('User', {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    username: t.exposeString('username'),
    spammy: t.exposeBoolean('spammy'),
    isVerified: t.exposeBoolean('isVerified'),
    isStaff: t.exposeBoolean('isStaff'),
    inWaitlist: t.exposeBoolean('inWaitlist'),
    email: t.exposeString('email', {
      nullable: true,
      authScopes: { isStaff: true, $granted: 'currentUser' }
    }),
    hasFollowed: t.field({
      type: 'Boolean',
      resolve: async (parent, args, { session }) => {
        if (!session) return false
        return await hasFollowed(session?.userId as string, parent.id)
      }
    }),
    isFollowing: t.field({
      type: 'Boolean',
      resolve: async (parent, args, { session }) => {
        if (!session) return false
        return await isFollowing(session?.userId as string, parent.id)
      }
    }),
    htmlUrl: t.field({
      type: 'String',
      resolve: (parent) => {
        return `${BASE_URL}/u/${parent?.username}`
      }
    }),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    featuredAt: t.expose('featuredAt', { type: 'DateTime', nullable: true }),

    // Relations
    profile: t.relation('profile'),
    tip: t.relation('tip', { nullable: true }),
    status: t.relation('status', { nullable: true }),
    integrations: t.relation('integrations', { nullable: true }),
    badges: t.relatedConnection('badges', { cursor: 'id', totalCount: true }),
    topics: t.relatedConnection('topics', { cursor: 'id', totalCount: true }),
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { hidden: false },
        orderBy: { createdAt: 'desc' }
      })
    }),
    bookmarks: t.relatedConnection('bookmarks', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { post: { hidden: false } },
        orderBy: { createdAt: 'desc' }
      })
    }),
    hasWakatimeIntegration: t.field({
      type: 'Boolean',
      resolve: async (parent) => {
        const integration = await db.integration.findFirst({
          where: { userId: parent.id }
        })
        return integration?.wakatimeAPIKey ? true : false
      }
    }),
    hasSpotifyIntegration: t.field({
      type: 'Boolean',
      resolve: async (parent) => {
        const integration = await db.integration.findFirst({
          where: { userId: parent.id }
        })
        return integration?.spotifyRefreshToken ? true : false
      }
    }),
    masquerading: t.field({
      type: 'Boolean',
      authScopes: { user: true },
      nullable: true,
      resolve: async (parent, args, { session }) => {
        const resolvedSession = await db.session.findFirst({
          where: { id: session?.id }
        })
        return resolvedSession?.masquerading
      }
    }),
    notificationsCount: t.field({
      type: 'Int',
      authScopes: { $granted: 'currentUser' },
      resolve: async (parent, args, { session }) => {
        return await db.notification.count({
          where: { receiver: { id: session?.userId }, isRead: false }
        })
      }
    }),
    invite: t.relation('invite', {
      nullable: true,
      authScopes: { isStaff: true, $granted: 'currentUser' }
    }),
    ownedProducts: t.relatedConnection('ownedProducts', {
      cursor: 'id',
      totalCount: true,
      query: () => ({ where: { hidden: false } })
    }),
    communities: t.relatedConnection('ownedCommunities', {
      cursor: 'id',
      totalCount: true,
      query: () => ({ where: { hidden: false } })
    }),
    followers: t.relatedConnection('followedBy', {
      cursor: 'id',
      totalCount: true,
      query: () => ({ where: { spammy: false } })
    }),
    following: t.relatedConnection('following', {
      cursor: 'id',
      totalCount: true,
      query: () => ({ where: { spammy: false } })
    })
  })
})

builder.queryField('user', (t) =>
  t.prismaField({
    type: 'User',
    args: { username: t.arg.string() },
    nullable: true,
    resolve: async (query, parent, { username }) => {
      return await db.user.findFirst({
        ...query,
        where: { username, inWaitlist: false },
        rejectOnNotFound: true
      })
    }
  })
)

builder.queryField('users', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    resolve: async (query) => {
      return await getUsers(query)
    }
  })
)

builder.queryField('whoToFollow', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    authScopes: { user: true },
    resolve: async (query, parent, args, { session }) => {
      return await getWhoToFollow(query, session)
    }
  })
)

builder.queryField('suggestedUsers', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    authScopes: { user: true },
    resolve: async (query, parent, args, { session }) => {
      return await getSuggestedUsers(query, session)
    }
  })
)

builder.queryField('featuredUsers', (t) =>
  t.prismaConnection({
    type: 'User',
    cursor: 'id',
    resolve: async (query) => {
      return await getFeaturedUsers(query)
    }
  })
)

const EditUserInput = builder.inputType('EditUserInput', {
  fields: (t) => ({
    username: t.string({
      required: true,
      validate: { minLength: 2, maxLength: 50 }
    }),
    email: t.string({ required: true, validate: { email: true } }),
    name: t.string({
      required: true,
      validate: { minLength: 2, maxLength: 50 }
    }),
    bio: t.string({ required: false, validate: { maxLength: 190 } }),
    location: t.string({ required: false, validate: { maxLength: 100 } }),
    avatar: t.string(),
    cover: t.string()
  })
})

// TODO: Split to function
builder.mutationField('editUser', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: EditUserInput }) },
    authScopes: { user: true },
    resolve: async (query, parent, { input }, { session }) => {
      try {
        const user = await db.user.update({
          ...query,
          where: { id: session!.userId },
          data: {
            username: input.username,
            email: input.email,
            profile: {
              update: {
                name: input.name,
                bio: input.bio,
                location: input.location,
                avatar: input.avatar,
                cover: input.cover
              }
            }
          }
        })
        createLog(session!.userId, user?.id, 'SETTINGS_UPDATE')

        return user
      } catch (error: any) {
        if (
          error.code === 'P2002' &&
          error.meta.target === 'users_username_key'
        ) {
          throw new Error('Username is already taken!')
        }

        if (error.code === 'P2002' && error.meta.target === 'users_email_key') {
          throw new Error('Email is already taken!')
        }

        throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
      }
    }
  })
)

const EditNFTAvatarInput = builder.inputType('EditNFTAvatarInput', {
  fields: (t) => ({
    avatar: t.string({ required: true }),
    nftSource: t.string({ required: true })
  })
})

// TODO: Split to function
builder.mutationField('editNFTAvatar', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: EditNFTAvatarInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      try {
        return await db.user.update({
          ...query,
          where: { id: session!.userId },
          data: {
            profile: {
              update: { avatar: input.avatar, nftSource: input.nftSource }
            }
          }
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
        }
      }
    }
  })
)

const ToggleFollowInput = builder.inputType('ToggleFollowInput', {
  fields: (t) => ({
    userId: t.id({ validate: { uuid: true } })
  })
})

// TODO: Split to function
builder.mutationField('toggleFollow', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: ToggleFollowInput }) },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      return await toggleFollow(session?.userId as string, input?.userId)
    }
  })
)

// Staff Ops
const ModUserInput = builder.inputType('ModUserInput', {
  fields: (t) => ({
    userId: t.id({ validate: { uuid: true } }),
    isVerified: t.boolean({ required: false }),
    isStaff: t.boolean({ required: false }),
    featuredAt: t.boolean({ required: false }),
    spammy: t.boolean({ required: false })
  })
})

builder.mutationField('modUser', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: ModUserInput }) },
    nullable: true,
    authScopes: {
      isStaff: true
    },
    resolve: async (query, parent, { input }) => {
      return modUser(query, input)
    }
  })
)

const OnboardUserInput = builder.inputType('OnboardUserInput', {
  fields: (t) => ({
    userId: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('onboardUser', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: OnboardUserInput }) },
    nullable: true,
    resolve: async (query, parent, { input }) => {
      return await db.user.update({
        where: { id: input.userId },
        data: { inWaitlist: false }
      })
    }
  })
)

const AcceptCOCAndTOSInput = builder.inputType('AcceptCOCAndTOSInput', {
  fields: (t) => ({
    coc: t.boolean(),
    tos: t.boolean()
  })
})

builder.mutationField('acceptCocAndTos', (t) =>
  t.prismaField({
    type: 'User',
    args: { input: t.arg({ type: AcceptCOCAndTOSInput }) },
    resolve: async (query, parent, { input }, { session }) => {
      if (input.coc && input.tos) {
        return await db.user.update({
          where: { id: session?.userId },
          data: { onboarded: true }
        })
      } else {
        throw new Error('You must check all!')
      }
    }
  })
)

builder.mutationField('deleteAccount', (t) =>
  t.field({
    type: Result,
    resolve: async (parent, args, { session }) => {
      return await deleteAccount(session)
    }
  })
)

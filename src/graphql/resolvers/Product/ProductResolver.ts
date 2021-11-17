import { builder } from '@graphql/builder'
import { Prisma } from '@prisma/client'
import { db } from '@utils/prisma'
import {
  BASE_URL,
  ERROR_MESSAGE,
  IS_PRODUCTION,
  RESERVED_SLUGS
} from 'src/constants'

import { Result } from '../ResultResolver'
import { createProduct } from './mutations/createProduct'
import { deleteProduct } from './mutations/deleteProduct'
import { editProductSocial } from './mutations/editProductSocial'
import { toggleSubscribe } from './mutations/toggleSubscribe'
import { getProducts } from './queries/getProducts'
import { hasSubscribed } from './queries/hasSubscribed'

builder.prismaObject('Product', {
  findUnique: (post) => ({ id: post.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    slug: t.exposeString('slug'),
    description: t.exposeString('description', { nullable: true }),
    avatar: t.exposeString('avatar', { nullable: true }),
    website: t.exposeString('website', { nullable: true }),
    producthunt: t.exposeString('producthunt', { nullable: true }),
    discord: t.exposeString('discord', { nullable: true }),
    github: t.exposeString('github', { nullable: true }),
    twitter: t.exposeString('twitter', { nullable: true }),
    hasSubscribed: t.field({
      type: 'Boolean',
      resolve: async (parent, args, { session }) => {
        if (!session) return false
        return await hasSubscribed(session?.userId as string, parent.id)
      }
    }),
    htmlUrl: t.field({
      type: 'String',
      resolve: (parent) => {
        return `${BASE_URL}/products/${parent?.slug}`
      }
    }),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),

    // Relations
    owner: t.relation('owner'),
    subscribers: t.relatedConnection('subscribers', {
      cursor: 'id',
      totalCount: true
    }),
    posts: t.relatedConnection('posts', {
      cursor: 'id',
      totalCount: true,
      query: () => ({
        where: { hidden: false },
        orderBy: { createdAt: 'desc' }
      })
    })
  })
})

builder.queryField('products', (t) =>
  t.prismaConnection({
    type: 'Product',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    resolve: async (query) => {
      return await getProducts(query)
    }
  })
)

builder.queryField('product', (t) =>
  t.prismaField({
    type: 'Product',
    args: { slug: t.arg.string() },
    resolve: async (query, parent, { slug }) => {
      return await db.product.findFirst({
        ...query,
        where: { slug, hidden: false },
        rejectOnNotFound: true
      })
    }
  })
)

const CreateProductInput = builder.inputType('CreateProductInput', {
  fields: (t) => ({
    name: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    slug: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    website: t.string({
      validate: { minLength: 2, maxLength: 100, url: true }
    }),
    description: t.string({ required: false, validate: { maxLength: 190 } })
  })
})

builder.mutationField('createProduct', (t) =>
  t.prismaField({
    type: 'Product',
    args: { input: t.arg({ type: CreateProductInput }) },
    nullable: true,
    authScopes: { user: true },
    resolve: async (query, parent, { input }, { session }) => {
      return await createProduct(query, input, session)
    }
  })
)

const EditProductProfileInput = builder.inputType('EditProductProfileInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } }),
    slug: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    name: t.string({ validate: { minLength: 2, maxLength: 50 } }),
    description: t.string({ required: false, validate: { maxLength: 255 } }),
    avatar: t.string({ required: false })
  })
})

// TODO: Split to function
builder.mutationField('editProductProfile', (t) =>
  t.prismaField({
    type: 'Product',
    args: { input: t.arg({ type: EditProductProfileInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (query, parent, { input }) => {
      if (RESERVED_SLUGS.includes(input.slug)) {
        throw new Error(`Product slug "${input.slug}" is reserved by Devparty.`)
      }

      try {
        return await db.product.update({
          ...query,
          where: { id: input?.id },
          data: {
            slug: input.slug,
            name: input.name,
            description: input.description,
            avatar: input.avatar
          }
        })
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new Error('Product slug is already taken!')
          }

          throw new Error(IS_PRODUCTION ? ERROR_MESSAGE : error.message)
        }
      }
    }
  })
)

const EditProductSocialInput = builder.inputType('EditProductSocialInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } }),
    website: t.string({
      required: false,
      validate: { maxLength: 100, url: true }
    }),
    twitter: t.string({ required: false, validate: { maxLength: 50 } }),
    github: t.string({ required: false, validate: { maxLength: 50 } }),
    discord: t.string({ required: false, validate: { maxLength: 50 } })
  })
})

builder.mutationField('editProductSocial', (t) =>
  t.prismaField({
    type: 'Product',
    args: { input: t.arg({ type: EditProductSocialInput }) },
    authScopes: { user: true },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      return await editProductSocial(query, input, session)
    }
  })
)

const ToggleProductSubscribeInput = builder.inputType(
  'ToggleProductSubscribeInput',
  {
    fields: (t) => ({
      id: t.id({ validate: { uuid: true } })
    })
  }
)

builder.mutationField('toggleProductSubscribe', (t) =>
  t.prismaField({
    type: 'Product',
    args: { input: t.arg({ type: ToggleProductSubscribeInput }) },
    nullable: true,
    resolve: async (query, parent, { input }, { session }) => {
      return await toggleSubscribe(session?.userId as string, input.id)
    }
  })
)

const DeleteProductInput = builder.inputType('DeleteProductInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('deleteProduct', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: DeleteProductInput }) },
    resolve: async (parent, { input }, { session }) => {
      return await deleteProduct(input, session)
    }
  })
)

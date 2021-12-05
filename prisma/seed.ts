import 'tsconfig-paths/register'

import { getRandomCover } from '@graphql/utils/getRandomCover'
import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@utils/auth'
import faker from 'faker'
import { md5 } from 'hash-wasm'

import { badgeData } from './seeds/badges'
import { communityData, rulesData } from './seeds/communities'
import { productData } from './seeds/products'
import { topicsData } from './seeds/topics'
import { userData } from './seeds/users'

const hplipsum = require('hplipsum')
const db = new PrismaClient()

async function main() {
  await db.topic.deleteMany()
  console.log('All topics have been deleted 🗑️')
  await db.postTopic.deleteMany()
  console.log('All post topics have been deleted 🗑️')
  await db.like.deleteMany()
  console.log('All likes have been deleted 🗑️')
  await db.post.deleteMany()
  console.log('All posts have been deleted 🗑️')
  await db.product.deleteMany()
  console.log('All products have been deleted 🗑️')
  await db.notification.deleteMany()
  console.log('All notifications have been deleted 🗑️')
  await db.session.deleteMany()
  console.log('All sessions have been deleted 🗑️')
  await db.integration.deleteMany()
  console.log('All integrations have been deleted 🗑️')
  await db.profile.deleteMany()
  console.log('All profiles have been deleted 🗑️')
  await db.invite.deleteMany()
  console.log('All invites have been deleted 🗑️')
  await db.user.deleteMany()
  console.log('All users have been deleted 🗑️')
  await db.community.deleteMany()
  console.log('All communities have been deleted 🗑️')
  await db.report.deleteMany()
  console.log('All reports have been deleted 🗑️')

  const reportTypes = ['POST', 'USER', 'PRODUCT', 'COMMUNITY']

  // Fake User
  for (let i = 0; i < 50; i++) {
    const username =
      `${faker.name.firstName()}${faker.name.lastName()}`.toLocaleLowerCase()
    console.log(`🌱 Seeding fake user - @${username} 👦`)
    await db.user.create({
      data: {
        email: `${username}@yogi.codes`,
        username,
        inWaitlist: faker.datatype.boolean(),
        hashedPassword: await hashPassword(username),
        profile: {
          create: {
            name: faker.name.firstName(),
            avatar: `https://avatar.tobi.sh/${await md5(username)}.svg?text=👦`,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color,
            bio: faker.commerce.productDescription()
          }
        },
        posts: { create: { body: faker.lorem.sentence(20) } }
      }
    })
  }

  // Real User
  for (const user of userData) {
    console.log(`🌱 Seeding real user - @${user.username} 👦`)
    await db.user.create({
      data: {
        email: user.email,
        username: user.username,
        isStaff: user.isStaff,
        inWaitlist: false,
        isVerified: true,
        onboarded: true,
        hashedPassword: await hashPassword(user.username),
        profile: {
          create: {
            name: user.name,
            avatar: user.avatar,
            cover: getRandomCover().image,
            coverBg: getRandomCover().color,
            bio: user.bio
          }
        },
        integrations: { create: { ethAddress: user.ethAddress } }
      }
    })
  }

  // Fake Products
  for (let i = 0; i < 20; i++) {
    const slug =
      `${faker.name.firstName()}${faker.name.lastName()}`.toLocaleLowerCase()
    console.log(`🌱 Seeding fake product - ${slug} 🚀`)
    await db.product.create({
      data: {
        slug,
        name: faker.company.companyName(),
        avatar: `https://avatar.tobi.sh/${await md5(slug)}.svg?text=🚀`,
        description: faker.lorem.sentence(10),
        owner: {
          connect: {
            username:
              userData[Math.floor(Math.random() * userData.length)].username
          }
        }
      }
    })
  }

  // Product
  for (const product of productData) {
    console.log(`🌱 Seeding real product - ${product.slug} 🚀`)
    await db.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        avatar: `https://avatar.tobi.sh/${await md5(product.name)}.svg?text=🚀`,
        description: product.description,
        owner: { connect: { username: product.username } }
      }
    })
  }

  // Community
  for (const community of communityData) {
    console.log(`🌱 Seeding real community - ${community.slug} 🎭`)
    await db.community.create({
      data: {
        name: community.name,
        slug: community.slug,
        avatar: `https://avatar.tobi.sh/${await md5(
          community.slug
        )}.svg?text=🎭`,
        description: community.description,
        owner: { connect: { username: community.username } },
        members: {
          connect: {
            username:
              userData[Math.floor(Math.random() * userData.length)].username
          }
        },
        moderators: { connect: { username: 'yoginth' } },
        rules: { createMany: { data: rulesData } }
      }
    })
  }

  // Badges
  for (const badge of badgeData) {
    console.log(`🌱 Seeding real badge - ${badge.name} 🏆`)
    await db.badge.create({
      data: {
        name: badge.name,
        image: badge.image,
        description: badge.description,
        users: { connect: { username: 'yoginth' } }
      }
    })
  }

  // Post
  for (let i = 0; i < 200; i++) {
    const body = hplipsum(10)
    const done = faker.datatype.boolean()
    const post = await db.post.create({
      data: {
        body: body,
        done,
        type: done ? 'TASK' : 'POST',
        attachments: faker.datatype.boolean()
          ? {
              createMany: {
                data: [
                  {
                    index: 1,
                    type: 'image/png',
                    url: `https://placeimg.com/800/480/nature/${faker.datatype.uuid()}`
                  },
                  {
                    index: 2,
                    type: 'image/png',
                    url: `https://placeimg.com/800/480/nature/${faker.datatype.uuid()}`
                  },
                  {
                    index: 3,
                    type: 'image/png',
                    url: `https://placeimg.com/800/480/nature/${faker.datatype.uuid()}`
                  },
                  {
                    index: 4,
                    type: 'image/png',
                    url: `https://placeimg.com/800/480/nature/${faker.datatype.uuid()}`
                  }
                ]
              }
            }
          : undefined,
        user: {
          connect: {
            username:
              userData[Math.floor(Math.random() * userData.length)].username
          }
        }
      }
    })

    console.log(`🌱 Seeding fake post - ${post?.id} 📜`)
  }

  // Report
  for (let i = 0; i < 50; i++) {
    const message = hplipsum(10)
    const report = await db.report.create({
      data: {
        message,
        type: reportTypes[
          Math.floor(Math.random() * reportTypes.length)
        ] as any,
        user: {
          connect: {
            username:
              userData[Math.floor(Math.random() * userData.length)].username
          }
        },
        post: {
          create: {
            body: message,
            user: {
              connect: {
                username:
                  userData[Math.floor(Math.random() * userData.length)].username
              }
            }
          }
        }
      }
    })

    console.log(`🌱 Seeding fake report - ${report?.id} 🚩`)
  }

  // Real Topic
  for (const topic of topicsData) {
    console.log(`🌱 Seeding real topics - #${topic.name} #️⃣`)
    await db.topic.create({
      data: {
        name: topic.name,
        featuredAt: new Date(),
        starrers: {
          connect: {
            username:
              userData[Math.floor(Math.random() * userData.length)].username
          }
        }
      }
    })
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

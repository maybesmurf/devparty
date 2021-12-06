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
  const tipsData = [
    {
      name: 'A dollar goes along way 💰 ',
      description:
        "If you and 6000 other people do this I will quit my day job and work on open source full time. You'll be added to https://yogi.codes/thanks.",
      amount: 1
    },
    {
      name: 'Coffee Support ❤️',
      description:
        "You will receive a Sponsor badge 🎖 on your profile and if you're in town (and I'm there) the coffee is on me.",
      amount: 5
    },
    {
      name: 'Pen Pal ✍️',
      description:
        "Thanks for supporting my work! You'll get early access to blog posts before they come out.",
      amount: 10
    },
    {
      name: 'Hops Sponsor 🍺 ',
      description:
        "If you're in town (and I'm there) it's my shout. If you don't drink then we can do high-tea ☕ or whatever.",
      amount: 25
    },
    {
      name: '🍌📞',
      description:
        "Let's schedule a monthly half-hour-long phone or video call where you get to chat with me about whatever you want related to your career, open source, the projects I work on, or other stuff like that! I'm open to ideas! (All discussions non-corporate).",
      amount: 50
    }
  ]

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

  // Test seeds
  console.log('🌱 Seeding test data')
  await db.post.create({
    data: {
      // id: '89bee9b8-a958-48de-8c9d-55e20b75ccf2',
      body: 'Hello, World! This is https://devparty.io',
      type: 'POST',
      user: { connect: { username: 'yoginth' } },
      product: { connect: { slug: 'devparty' } },
      nft: {
        create: {
          address: '0x3b3ee1931dc30c1957379fac9aba94d1c48a5405',
          tokenId: '1',
          network: 'maticmum'
        }
      },
      attachments: {
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
    }
  })

  await db.user.update({
    where: { username: 'yoginth' },
    data: {
      tip: {
        create: {
          bitcoin: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          ethereum: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
          buymeacoffee: 'yoginth',
          github: 'yoginth',
          cash: 'yoginth',
          paypal: 'yoginth',
          tiers: { createMany: { data: tipsData } }
        }
      },
      profile: {
        update: {
          twitter: 'yogicodes',
          github: 'yoginth',
          discord: 'Yogi#1111',
          website: 'https://yogi.codes'
        }
      }
    }
  })

  await db.user.update({
    where: { username: 'admin' },
    data: {
      tip: {
        create: {
          ethereum: '0xd3B307753097430FaEdFdb89809610bF8e8f3203',
          tiers: { createMany: { data: tipsData } }
        }
      }
    }
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

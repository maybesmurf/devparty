import 'tsconfig-paths/register'

import { PrismaClient } from '@prisma/client'
import faker from 'faker'

const db = new PrismaClient()

async function main() {
  console.log('🌱 Seeding test post')
  await db.post.create({
    data: {
      id: '89bee9b8-a958-48de-8c9d-55e20b75ccf2',
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

  console.log('🌱 Seeding test user')
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
          paypal: 'yoginth'
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
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })

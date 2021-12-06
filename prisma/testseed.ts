import 'tsconfig-paths/register'

import { PrismaClient } from '@prisma/client'
import faker from 'faker'

const db = new PrismaClient()

async function main() {
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

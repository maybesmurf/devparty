import { PrismaClient } from '@prisma/client'
import { IS_PRODUCTION } from 'src/constants'

// Ensure that there's only a single Prisma instance in dev. This is detailed here:
// https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
declare global {
  var __globalPrisma__: PrismaClient
}

export let db: PrismaClient

if (IS_PRODUCTION) {
  db = new PrismaClient({
    log: ['error', 'warn']
  })
} else {
  if (!global.__globalPrisma__) {
    global.__globalPrisma__ = new PrismaClient({
      log: ['error', 'warn']
    })
  }

  db = global.__globalPrisma__
}

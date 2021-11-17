import SchemaBuilder from '@giraphql/core'
import DirectivePlugin from '@giraphql/plugin-directives'
import PrismaPlugin from '@giraphql/plugin-prisma'
import RelayPlugin from '@giraphql/plugin-relay'
import ScopeAuthPlugin from '@giraphql/plugin-scope-auth'
import SimpleObjectsPlugin from '@giraphql/plugin-simple-objects'
import ValidationPlugin from '@giraphql/plugin-validation'
import { Session } from '@prisma/client'
import { db } from '@utils/prisma'
import { IncomingMessage, OutgoingMessage } from 'http'
import PrismaTypes from 'prisma/giraphql-types'

export interface Context {
  req: IncomingMessage
  res: OutgoingMessage
  session?: Session | null
}

export function createGraphQLContext(
  request: IncomingMessage,
  res: OutgoingMessage,
  session?: Session | null
): Context {
  return {
    req: request,
    res,
    session
  }
}

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes
  DefaultInputFieldRequiredness: true
  Context: Context
  Scalars: {
    ID: { Input: string; Output: string | number }
    DateTime: { Input: Date; Output: Date }
  }
  AuthScopes: {
    public: boolean
    user: boolean
    unauthenticated: boolean
    staff: boolean
  }
}>({
  defaultInputFieldRequiredness: true,
  useGraphQLToolsUnorderedDirectives: true,
  plugins: [
    SimpleObjectsPlugin,
    ScopeAuthPlugin,
    ValidationPlugin,
    PrismaPlugin,
    RelayPlugin,
    DirectivePlugin
  ],
  prisma: { client: db },
  authScopes: ({ session }) => ({
    public: true,
    user: !!session,
    unauthenticated: !session,
    staff: !!session?.isStaff
  }),
  relayOptions: {
    clientMutationId: 'omit',
    cursorType: 'String'
  }
})

builder.queryType({})
builder.mutationType({
  authScopes: { user: true }
})

// Custom Scalar Types
builder.scalarType('DateTime', {
  serialize: (date: any) => date.toISOString(),
  parseValue: (date: any) => {
    return new Date(date)
  }
})

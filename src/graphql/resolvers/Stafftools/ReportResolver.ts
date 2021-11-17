import { builder } from '@graphql/builder'

import { Result } from '../ResultResolver'
import { createReport } from './mutations/createReport'
import { resolveReport } from './mutations/resolveReport'
import { getReports } from './queries/getReports'

builder.prismaObject('Report', {
  findUnique: (report) => ({ id: report.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    type: t.exposeString('type'),
    message: t.exposeString('message'),

    // Timestamps
    createdAt: t.expose('createdAt', { type: 'DateTime' }),

    // Relations
    user: t.relation('user'),
    post: t.relation('post', { nullable: true })
  })
})

builder.queryField('reports', (t) =>
  t.prismaConnection({
    type: 'Report',
    cursor: 'id',
    defaultSize: 20,
    maxSize: 100,
    authScopes: { staff: true },
    resolve: async (query) => {
      return await getReports(query)
    }
  })
)

const CreateReportInput = builder.inputType('CreateReportInput', {
  fields: (t) => ({
    message: t.string({ validate: { minLength: 1, maxLength: 10000 } }),
    type: t.string()
  })
})

builder.mutationField('createReport', (t) =>
  t.prismaField({
    type: 'Report',
    args: { input: t.arg({ type: CreateReportInput }) },
    resolve: async (query, parent, { input }, { session }) => {
      return await createReport(query, input, session)
    }
  })
)

const ResolveReportInput = builder.inputType('ResolveReportInput', {
  fields: (t) => ({
    id: t.id({ validate: { uuid: true } })
  })
})

builder.mutationField('resolveReport', (t) =>
  t.field({
    type: Result,
    args: { input: t.arg({ type: ResolveReportInput }) },
    authScopes: { staff: true },
    nullable: true,
    resolve: async (parent, { input }) => {
      return await resolveReport(input.id)
    }
  })
)

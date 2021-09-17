import { prisma } from '@utils/prisma'

export const exploreFeed = async (query: any) => {
  return await prisma.post.findMany({
    ...query,
    where: { user: { spammy: false }, hidden: false },
    orderBy: [
      { likes: { _count: 'desc' } },
      { replies: { _count: 'desc' } },
      { topics: { _count: 'desc' } },
      { user: { updatedAt: 'desc' } }
    ]
  })
}

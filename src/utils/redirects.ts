import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { db } from './prisma'
import { resolveSession } from './sessions'

/**
 * Check for the route is gated to staff
 * @param context - Next.js server side props context
 * @param redirect - Redirect to the target URL
 * @returns redirect props
 */
export async function staffRoute(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> {
  const session = await resolveSession(context)

  if (!session?.isStaff) {
    return { notFound: true }
  }

  return { props: {} }
}

/**
 * Check for the route is gated to the current user
 * @param context - Next.js server side props context
 * @param redirect - Redirect to the target URL
 * @returns redirect props
 */
export async function personalRoute(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> {
  const session = await resolveSession(context)
  const user = await db.user.findUnique({
    where: { username: context?.query.username as string }
  })

  if (user?.id !== session?.userId) {
    return { notFound: true }
  }

  return { props: {} }
}

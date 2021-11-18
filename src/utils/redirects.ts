import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'

import { db } from './prisma'
import { resolveSession } from './sessions'

/**
 * Check for the route is unauthenticated
 * @param context - Next.js server side props context
 * @param redirect - Redirect to the target URL
 * @returns redirect props
 */
export async function unauthenticatedRoute(context: GetServerSidePropsContext) {
  const session = await resolveSession(context)

  if (session) {
    return {
      redirect: {
        destination: '/home',
        permanent: false
      }
    }
  }

  return { props: {} }
}

/**
 * Check for the route is authenticated
 * @param context - Next.js server side props context
 * @param redirect - Redirect to the target URL
 * @returns redirect props
 */
export async function authenticatedRoute(
  context: GetServerSidePropsContext,
  checkOnboardStatus = false
): Promise<GetServerSidePropsResult<{}>> {
  const session = await resolveSession(context, checkOnboardStatus)
  const onboarded = session?.hasOwnProperty('user') && !session?.user?.onboarded

  if (!session) {
    return {
      redirect: {
        destination: `/login?redirect=${encodeURIComponent(
          context.resolvedUrl
        )}`,
        permanent: false
      }
    }
  }

  if (onboarded) {
    return {
      redirect: { destination: '/onboarding', permanent: false }
    }
  }

  return { props: {} }
}

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

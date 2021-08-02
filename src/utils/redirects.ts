import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { resolveSession } from './sessions'

export async function unauthenticatedRoute(
  ctx: GetServerSidePropsContext,
  redirect: string = '/'
) {
  const session = await resolveSession(ctx)

  if (session) {
    return {
      redirect: {
        destination: redirect,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

export async function authenticatedRoute(
  ctx: GetServerSidePropsContext,
  redirect = '/signup'
): Promise<GetServerSidePropsResult<{}>> {
  const session = await resolveSession(ctx)

  if (!session) {
    return {
      redirect: {
        destination: `${redirect}?redirect=${encodeURIComponent(
          ctx.resolvedUrl
        )}`,
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}

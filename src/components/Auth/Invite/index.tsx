import { gql, useQuery } from '@apollo/client'
import Hero from '@components/shared/Hero'
import Slug from '@components/shared/Slug'
import { formatUsername } from '@components/utils/formatUsername'
import { humanize } from '@components/utils/humanize'
import { GetInviteQuery } from '@graphql/types.generated'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

import SignupForm from './Form'

export const GET_INVITE_QUERY = gql`
  query GetInvite($code: String!) {
    invite(code: $code) {
      user {
        id
        username
      }
    }
    waitlistCount {
      count
    }
  }
`

const InviteSignup: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<GetInviteQuery>(GET_INVITE_QUERY, {
    variables: {
      code: router.query.code
    },
    skip: !router.isReady
  })
  const invite = data?.invite
  const waitlistCount = data?.waitlistCount?.count

  return (
    <div className="flex flex-grow">
      <Head>
        <title>Join Devparty</title>
      </Head>
      <div className="grid grid-cols-12 w-full">
        <Hero />
        <div className="lg:col-span-5 md:col-span-12 col-span-12 py-8 lg:px-14 md:px-10 sm:px-5 px-5 flex flex-col">
          <div className="space-y-7 flex-grow">
            <img
              src={`${STATIC_ASSETS}/emojis/love.png`}
              className="w-20"
              alt="Love Emoji"
            />
            <div className="space-y-2">
              <div className="font-extrabold text-4xl">Signup</div>
              {loading ? (
                <div className="shimmer h-7 max-w-sm rounded-lg" />
              ) : (
                !error && (
                  <div className="text-xl space-y-2">
                    <Link href={`/u/${invite?.user?.username}`} passHref>
                      <a className="font-bold">
                        <Slug
                          slug={formatUsername(
                            invite?.user?.username as string
                          )}
                          prefix="@"
                        />{' '}
                        invited you to the party
                      </a>
                    </Link>
                    <div className="text-sm font-bold">
                      You will be user{' '}
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2 py-0.5 rounded-md">
                        #{humanize(waitlistCount as number)}
                      </span>
                    </div>
                  </div>
                )
              )}
              <div className="linkify">
                Already have an account?{' '}
                <Link href="/login" passHref>
                  <a className="font-bold">Login now</a>
                </Link>
              </div>
            </div>
            {error ? (
              <div className="text-red-500 text-xl font-bold">
                {error?.message}
              </div>
            ) : (
              <SignupForm />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InviteSignup

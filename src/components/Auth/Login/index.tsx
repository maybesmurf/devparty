import Hero from '@components/shared/Hero'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { STATIC_ASSETS } from 'src/constants'

import LoginForm from './Form'

const Login: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const router = useRouter()

  if (currentUser) {
    if (process.browser) router.push('/home')
    return <PageLoading />
  }

  return (
    <div className="flex flex-grow">
      <Head>
        <title>Login to Devparty</title>
      </Head>
      <div className="grid grid-cols-12 w-full">
        <Hero />
        <div className="lg:col-span-5 md:col-span-12 col-span-12 py-8 lg:px-14 md:px-10 sm:px-5 px-5 flex flex-col">
          <div className="space-y-7 flex-grow">
            <img
              src={`${STATIC_ASSETS}/emojis/victory.png`}
              className="w-20"
              alt="Victory Emoji"
            />
            <div className="space-y-2">
              <div className="font-extrabold text-4xl">Login</div>
              <div className="linkify">
                New to Devparty?{' '}
                <Link href="/signup" passHref>
                  <a className="font-bold">Sign up for an account</a>
                </Link>
              </div>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

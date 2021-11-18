import Hero from '@components/shared/Hero'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

import SignupForm from './Form'

const Signup: React.FC = () => {
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
              src={`${STATIC_ASSETS}/emojis/handshake.png`}
              className="w-20"
              alt="Handshake Emoji"
            />
            <div className="space-y-2">
              <div className="font-extrabold text-4xl">Join Waitlist</div>
              <div className="linkify">
                Already have an account?{' '}
                <Link href="/login" passHref>
                  <a className="font-bold">Login now</a>
                </Link>
              </div>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup

import Link from 'next/link'
import { NextSeo } from 'next-seo'
import React from 'react'

import Hero from '~/components/shared/Hero'

import SignupForm from './Form'

const InviteSignup: React.FC = () => {
  return (
    <div className="flex flex-grow">
      <NextSeo
        title="Join Devparty"
        description="Join the social media for developers"
      />
      <div className="grid grid-cols-12 w-full">
        <Hero />
        <div className="lg:col-span-5 md:col-span-12 col-span-12 py-8 lg:px-14 md:px-10 sm:px-5 px-5 flex flex-col">
          <div className="space-y-7 flex-grow">
            <img
              src="https://i.ibb.co/BKTVBtF/invite.png"
              className="w-20"
              alt="Hero"
            />
            <div className="space-y-2">
              <div className="font-extrabold text-4xl">Signup</div>
              <div className="linkify">
                Already have an account?{' '}
                <Link href="/login">
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

export default InviteSignup

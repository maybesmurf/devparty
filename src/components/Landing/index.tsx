import Hero from '@components/shared/Hero'
import LandingFooter from '@components/shared/LandingFooter'
import { Button } from '@components/UI/Button'
import { ArrowCircleRightIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

const Landing: React.FC = () => {
  return (
    <div className="flex flex-grow">
      <div className="grid grid-cols-12 w-full">
        <Hero />
        <div className="lg:col-span-5 md:col-span-12 col-span-12 py-8 lg:px-14 md:px-10 sm:px-5 px-5 flex flex-col">
          <div className="space-y-7 flex-grow">
            <img
              src={`${STATIC_ASSETS}/emojis/wave.png`}
              className="w-20"
              alt="Waving Emoji"
            />
            <div className="font-extrabold text-4xl">
              Welcome, To the social media for developers
            </div>
            <div className="font-bold text-gray-700 dark:text-gray-400 text-2xl">
              Join Devparty today.
            </div>
            <div className="space-x-4 flex">
              <Link href="/signup" passHref>
                <a href="/signup">
                  <Button
                    size="lg"
                    variant="primary"
                    icon={<ArrowCircleRightIcon className="h-5 w-5" />}
                  >
                    Get started
                  </Button>
                </a>
              </Link>
            </div>
            <div className="linkify">
              Already have an account?{' '}
              <Link href="/login" passHref>
                <a href="/login" className="font-bold">
                  Log in
                </a>
              </Link>
            </div>
          </div>
          <LandingFooter />
        </div>
      </div>
    </div>
  )
}

export default Landing

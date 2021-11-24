import { ArrowCircleRightIcon, QrcodeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { Fragment } from 'react'

import Footer from '../shared/Footer'
import { Button } from '../UI/Button'

const About: React.FC = () => {
  return (
    <>
      <section className="px-2 pt-20 bg-white dark:bg-black dark:text-white md:px-0">
        <div className="container items-center max-w-6xl px-5 mx-auto space-y-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-left sm:text-5xl md:text-6xl md:text-center">
            <span className="block">
              the social media for{' '}
              <span className="block mt-1 text-purple-500 lg:inline lg:mt-0">
                developers
              </span>
            </span>
          </h1>
          <p className="w-full mx-auto text-base text-left text-gray-500 dark:text-gray-400 md:max-w-md sm:text-lg lg:text-2xl md:text-center">
            Build and hangout around the community of builders in the world.
          </p>
        </div>
        <div className="container items-center max-w-4xl px-5 mx-auto mt-16 text-center">
          <img
            alt="Hero Illustration"
            src="https://ipfs.infura.io/ipfs/QmcDpJhD72Bk7SJ2sD6mnW4h7p8wf7CCy5UHHLtvh7WtW9"
          />
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-black dark:text-white px-4">
        <div className="container max-w-6xl mx-auto">
          <span className="opacity-60 font-bold tracking-tight text-left uppercase">
            Features
          </span>
          <h2 className="mt-2 text-4xl">
            Featured packed for a perfect developers social media.
          </h2>
          <div className="grid gap-8 mt-10 md:grid-cols-2 lg:grid-cols-3 grid-cols-1 sm:px-8 xl:px-0">
            {[
              {
                title: 'Product',
                desc: 'Create your own product.',
                image: 'QmcK19jxKgs6EwX7mMXtQoYqqNBfDe7wT99WtSfqdq8sTE'
              },
              {
                title: 'Community',
                desc: 'Each product can create their community.',
                image: 'QmXLh1oE2fc8bfaEbiYNSmRwcyZ6izjBh5rwncoLqRXDKG'
              },
              {
                title: 'Post',
                desc: 'Discuss about your product in public.',
                image: 'QmcGUeibBfgkBHp4ct5gHjhQiNwXBtHthiWVW7uPwg9gPV'
              },
              {
                title: 'Topic',
                desc: 'Share your thoughts with topics.',
                image: 'QmUSrFZbzcp2xPSihf5zNTweb25jGDmNuJxy2JBWEdiFpj'
              },
              {
                title: 'Badge',
                desc: 'Show off your abilities to the world.',
                image: 'QmeR8EKDX66KCM8hBT7gkAiQWbAxBGUjzrPNhWRv37bTwB'
              },
              {
                title: 'Notification',
                desc: 'Get notified about the updates that you love to.',
                image: 'QmSSe2ZT5QZhB9KLJaSNNZCJArRuGkJcEq5zzo6PS6dhZN'
              }
            ].map(({ title, desc, image }, index) => {
              return (
                <div
                  key={index}
                  className="relative px-8 md:py-12 py-6 space-y-4 overflow-hidden"
                >
                  <div className="flex items-center md:justify-start justify-center">
                    <div>
                      <div className="rounded-full mr-4">
                        <img
                          className="w-16"
                          src={`https://ipfs.infura.io/ipfs/${image}`}
                          alt={title}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-start justify-between">
                      <h4 className="text-xl font-medium dark:text-gray-300 text-gray-700">
                        {title}
                      </h4>
                      <p className="text-sm opacity-70">{desc}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
          <div className="flex flex-wrap items-center -mx-3">
            <div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
              <div className="w-full lg:max-w-md">
                <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl font-heading">
                  Join Devparty today.
                </h2>
                <p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever.
                </p>
                <div className="flex items-center py-2 space-x-2 xl:py-3">
                  <QrcodeIcon className="w-5 h-5" />
                  <span className="font-medium text-gray-500 dark:text-gray-400">
                    Get your invite code and access the community.
                  </span>
                </div>
                <div className="md:mt-10 mt-6">
                  <Button size="lg" variant="primary">
                    <Link href="/signup" passHref>
                      <a className="flex items-center space-x-1.5">
                        <ArrowCircleRightIcon className="h-5 w-5" />
                        <div>Get started</div>
                      </a>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <div className="w-full mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
              <img
                className="mx-auto max-w-sm"
                src="https://ipfs.infura.io/ipfs/QmR7TPhoTk8LqxqjCmcADXpieDHZwp3aEJcUxh4dn3Wu9n"
                alt="Invite"
              />
            </div>
          </div>
        </div>
      </section>
      <div className="m-4 pb-4 flex justify-center">
        <Footer />
      </div>
    </>
  )
}

export default About

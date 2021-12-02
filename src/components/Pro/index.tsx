import Footer from '@components/shared/Footer'
import { Button } from '@components/UI/Button'
import { ArrowCircleRightIcon, QrcodeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'

const Pro: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <section className="px-2 pt-20 dark:text-white md:px-0">
        <div className="container items-center max-w-6xl px-5 mx-auto space-y-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-left sm:text-5xl md:text-6xl md:text-center">
            <span className="block">
              pick a plan that's{' '}
              <span className="block mt-1 text-purple-500 lg:inline lg:mt-0">
                right
              </span>{' '}
              for you!
            </span>
          </h1>
          <p className="w-full mx-auto text-base text-left text-gray-500 dark:text-gray-400 md:max-w-md sm:text-lg lg:text-2xl md:text-center">
            Pay for the features that you need.
          </p>
        </div>
        <section className="container items-center max-w-6xl py-20 px-5 mx-auto text-center">
          <div className="md:flex md:justify-between items-center gap-5">
            <div className="relative flex flex-col max-w-xs w-full items-center p-2 overflow-hidden dark:bg-gray-800 bg-white rounded-lg lg:items-start">
              <div
                style={{
                  backgroundImage:
                    'url(https://assets.devparty.io/images/patterns/1.svg)',
                  backgroundSize: '200%'
                }}
                className="flex object-cover shadow bg-indigo-300 rounded-t-lg p-5 flex-row justify-center w-full items-center"
              >
                <h1 className="text-lg text-center text-black leading-snug text-light md:text-2xl">
                  1 Month
                </h1>
              </div>
              <div className="text-left p-4 dark:bg-black w-full text-gray-400">
                <h1 className="text-center p-5 text-4xl dark:text-white font-bold">
                  Ξ 0.05
                </h1>
                <ul className="!list-disc !list-inside space-y-2">
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                </ul>
              </div>
            </div>
            <div className="relative transform max-w-xs scale-110 flex flex-col items-center w-full p-2 overflow-hidden text-left bg-white dark:bg-gray-800 rounded-lg lg:items-start">
              <div
                style={{
                  backgroundImage:
                    'url(https://assets.devparty.io/images/patterns/2.svg)',
                  backgroundSize: '200%'
                }}
                className="flex object-cover shadow bg-indigo-300 rounded-t-lg p-5 flex-row justify-center w-full items-center"
              >
                <h1 className="text-lg text-center leading-snug text-black text-light md:text-2xl">
                  6 Month
                </h1>
              </div>
              <div className="text-left p-4 w-full dark:bg-black text-gray-400">
                <h1 className="text-center p-5 text-4xl dark:text-white font-bold">
                  Ξ 0.1
                </h1>
                <ul className="!list-disc !list-inside space-y-2">
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                </ul>
              </div>
              <img
                className="absolute bottom-0 right-0 -mb-3 -mr-3"
                src="/eth.svg"
                alt=""
                width={50}
                height={50}
                draggable={false}
              />
            </div>
            <div className="relative max-w-xs flex flex-col items-center w-full p-2 overflow-hidden text-left bg-white dark:bg-gray-800 rounded-lg lg:items-start">
              <div
                style={{
                  backgroundImage:
                    'url(https://assets.devparty.io/images/patterns/1.svg)',
                  backgroundSize: '200%'
                }}
                className="flex object-cover shadow bg-indigo-300 rounded-t-lg p-5 flex-row justify-center w-full items-center"
              >
                <h1 className="text-lg text-center leading-snug text-black text-light md:text-2xl">
                  1 Year
                </h1>
              </div>
              <div className="text-left p-4 w-full dark:bg-black text-gray-400">
                <h1 className="text-center p-5 text-4xl dark:text-white font-bold">
                  Ξ 0.2
                </h1>
                <ul className="!list-disc !list-inside space-y-2">
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                  <li>Lorem Ipsum is simply Ipsum is simply Ipsum simply</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
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
    </div>
  )
}

export default Pro

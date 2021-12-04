import Footer from '@components/shared/Footer'
import { Disclosure } from '@headlessui/react'
import { ChevronUpIcon } from '@heroicons/react/outline'
import React from 'react'

import SingleTier from './SingleTier'

const Pro: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900">
      <section className="px-2 pt-20 dark:text-white md:px-0">
        <div className="container items-center max-w-6xl px-5 mx-auto space-y-6 text-center">
          <div className="text-4xl font-extrabold tracking-tight text-left sm:text-5xl md:text-6xl md:text-center">
            <span className="block">
              pick a plan that's{' '}
              <span className="block mt-1 text-purple-500 lg:inline lg:mt-0">
                right
              </span>{' '}
              for you!
            </span>
          </div>
          <p className="w-full mx-auto text-base text-left text-gray-500 dark:text-gray-400 md:max-w-md sm:text-lg lg:text-2xl md:text-center">
            Pay for the features that you need.
          </p>
        </div>
        <section className="container items-center max-w-6xl py-20 px-5 mx-auto text-center">
          <div className="md:flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between items-center gap-5">
            <SingleTier
              validity="1 Month"
              amount="0.05"
              preferred={false}
              bgImage="1"
            />
            <SingleTier
              validity="6 Months"
              amount="0.1"
              preferred={true}
              bgImage="1"
            />
            <SingleTier
              validity="1 Year"
              amount="0.3"
              preferred={false}
              bgImage="1"
            />
          </div>
        </section>
      </section>

      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
          <div className="text-2xl font-extrabold tracking-tight text-left sm:text-3xl md:text-4xl md:text-center">
            what people frequently ask about us?
          </div>
          <div className="flex flex-wrap items-center py-16">
            <div className="w-full max-w-xl p-2 mx-auto rounded-lg border">
              <Disclosure>
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-brand-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg hover:bg-brand-200 focus:outline-none">
                      <span>What is your refund policy?</span>
                      <ChevronUpIcon
                        className={`${
                          open ? '' : 'transform rotate-180'
                        } w-5 h-5`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500">
                      If you're unhappy with your purchase for any reason, email
                      us within 90 days and we'll refund you in full, no
                      questions asked.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
              <Disclosure as="div" className="mt-2">
                {({ open }) => (
                  <>
                    <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-brand-100 dark:bg-gray-900 dark:hover:bg-gray-800 rounded-lg hover:bg-brand-200 focus:outline-none">
                      <span>Do you offer technical support?</span>
                      <ChevronUpIcon
                        className={`${
                          open ? '' : 'transform rotate-180'
                        } w-5 h-5`}
                      />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-4 pt-4 pb-2 text-gray-500">
                      No.
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
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

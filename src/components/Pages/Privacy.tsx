import React, { Fragment } from 'react'

import Footer from '../shared/Footer'

const Privacy: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-center bg-brand-400 h-44 w-full">
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Privacy Policy
          </h1>
          <div className="flex justify-center mt-4">
            <div className="text-xs rounded-md px-2 py-0.5 text-white bg-gray-800">
              Updated Sept 11, 2021
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-center">
          <div className="relative mx-auto rounded-lg max-w-3/4 md:w-3/4">
            <div className="!p-8 prose max-w-none text-gray-900 dark:text-gray-200">
              <h2 className="text-black dark:text-white">TBD</h2>
              <p>TBD</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center pt-2 pb-6">
          <Footer />
        </div>
      </div>
    </>
  )
}

export default Privacy

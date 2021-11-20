import React, { Fragment } from 'react'

import Footer from '../shared/Footer'

const Terms: React.FC = () => {
  return (
    <>
      <div className="flex items-center justify-center bg-brand-400 h-44 w-full">
        <div className="relative text-center">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            Terms of Service
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
            <div className="!p-8 prose dark:prose-dark max-w-none text-gray-900 dark:text-gray-200">
              <p>
                Welcome to the Devparty. <b>(Devparty, "us" "we" or "our")</b>{' '}
                website. Please read these Terms of Service (the <b>"Terms"</b>)
                carefully because they govern your use of devparty.io and any
                other websites that we may later own or operate (each, a{' '}
                <b>"Site,"</b>
                and collectively, the <b>"Sites"</b>) and our application
                program interfaces (<b>"APIs"</b>).
              </p>
              <h2 className="text-black dark:text-white">
                1. Agreement to these Terms
              </h2>
              <p>
                By accessing this Website, accessible from devparty.io and/or
                www.devparty.io, you are agreeing to be bound by these Website
                Terms and Conditions of Use and agree that you are responsible
                for the agreement with any applicable local laws. If you
                disagree with any of these terms, you are prohibited from
                accessing this site. The materials contained in this Website are
                protected by copyright and trademark law.
              </p>
              <h2 className="text-black dark:text-white">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the
                materials on Devparty's Website for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a
                transfer of title, and under this license, you may not:
              </p>
              <ul>
                <li>modify or copy the materials;</li>
                <li>
                  use the materials for any commercial purpose or any public
                  display;
                </li>
                <li>
                  attempt to reverse engineer any software contained on
                  Devparty's Website or Devparty app itself;
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials; or
                </li>
                <li>
                  transferring the materials to another person or "mirror" the
                  materials on any other server.
                </li>
              </ul>
              <p>
                This will let Devparty terminate upon violations of any of these
                restrictions. Upon termination, your viewing right will also be
                terminated and you should destroy any downloaded materials in
                your possession whether it is printed or electronic format.
                These Terms of Service have been created by the sole developers
                and maintainers of this project.
              </p>
              <h2 className="text-black dark:text-white">3. Disclaimer</h2>
              <p>
                All the materials on Devparty's Website are provided "as is".
                Devparty makes no warranties, may it be expressed or implied,
                therefore negates all other warranties. Furthermore, Devparty
                does not make any representations concerning the accuracy or
                reliability of the use of the materials on its Website or
                otherwise relating to such materials or any sites linked to this
                Website.
              </p>
              <h2 className="text-black dark:text-white">4. Limitations</h2>
              <p>
                Devparty or its suppliers will not be held accountable for any
                damages that will arise with the use or inability to use the
                materials on Devparty's Website, even if Devparty or an
                authorized representative of this Website has been notified,
                orally or written, of the possibility of such damage. Some
                jurisdiction does not allow limitations on implied warranties or
                limitations of liability for incidental damages, these
                limitations may not apply to you.
              </p>
              <h2 className="text-black dark:text-white">
                5. Revisions and Errata
              </h2>
              <p>
                The materials appearing on Devparty's Website may include
                technical, typographical, or photographic errors. Devparty will
                not promise that any of the materials on this Website are
                accurate, complete, or current. Devparty may change the
                materials contained on its Website at any time without notice.
                Devparty does not make any commitment to update the materials.
              </p>
              <h2 className="text-black dark:text-white">6. Links</h2>
              <p>
                Devparty has not reviewed all of the sites linked to its Website
                and is not responsible for the contents of any such linked site.
                The presence of any link does not imply endorsement by Devparty
                of the site. The use of any linked website is at the user own
                risk.
              </p>
              <h2 className="text-black dark:text-white">
                7. Site Terms of Use Modifications
              </h2>
              <p>
                Devparty may revise these Terms of Use for its Website at any
                time without prior notice. By using this Website, you are
                agreeing to be bound by the current version of these Terms and
                Conditions of Use.
              </p>
              <h2 className="text-black dark:text-white">8. Your Privacy</h2>
              <p>
                Please check our{' '}
                <a
                  href="https://devparty.io/privacy"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy
                </a>{' '}
                for information about how we take care and protect your privacy.
              </p>
              <h2 className="text-black dark:text-white">9. Governing Law</h2>
              <p>
                Any claim related to Devparty Website shall be governed by the
                laws of in without regards to its conflict of law provisions.
              </p>
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

export default Terms

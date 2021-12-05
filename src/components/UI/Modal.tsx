import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import React, { Fragment } from 'react'

interface Props {
  title: React.ReactNode
  size?: 'md' | 'lg'
  show: boolean
  children: React.ReactNode[] | React.ReactNode
  onClose: () => void
}

export const Modal: React.FC<Props> = ({
  title,
  size = 'md',
  show,
  children,
  onClose
}) => {
  if (!show) return null

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          />
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-100"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={clsx(
                { 'sm:max-w-5xl': size === 'lg' },
                { 'sm:max-w-lg': size === 'md' },
                'inline-block align-bottom bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-t-lg sm:rounded-b-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full'
              )}
            >
              <div className="flex items-center justify-between border-b dark:border-gray-700 px-5 py-3.5">
                <div className="font-bold">{title}</div>
                <button
                  className="text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md p-1"
                  onClick={onClose}
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

import { FieldError } from './Form'

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  prefix?: string | React.ReactNode
  className?: string
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, prefix, type = 'text', error, className = '', ...props },
  ref
) {
  return (
    <label className="w-full">
      {label && (
        <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
          {label}
        </div>
      )}
      <div className="flex shadow-sm">
        {prefix && (
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-500">
            {prefix}
          </span>
        )}
        <input
          className={clsx(
            { '!border-red-500 placeholder-red-500': error },
            { 'rounded-l-lg': !prefix },
            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full rounded-r-lg',
            className
          )}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  )
})

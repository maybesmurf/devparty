import { ComponentProps, forwardRef } from 'react'

import { FieldError } from './Form'

interface Props extends ComponentProps<'textarea'> {
  label?: string
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea({ label, ...props }, ref) {
    return (
      <label>
        {label && (
          <div className="font-medium text-gray-800 dark:text-gray-200 mb-1">
            {label}
          </div>
        )}
        <textarea
          className="bg-white dark:bg-gray-800 w-full shadow-sm rounded-lg px-4 py-2 border border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20"
          ref={ref}
          {...props}
        />
        {props.name && <FieldError name={props.name} />}
      </label>
    )
  }
)

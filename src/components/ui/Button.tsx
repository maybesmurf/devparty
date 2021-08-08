import clsx from 'clsx'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef
} from 'react'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'success' | 'danger'
  outline?: boolean
  loading?: boolean
  children: React.ReactNode
  className?: string
}

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  {
    className = '',
    size = 'md',
    variant = 'primary',
    outline,
    loading,
    children,
    ...rest
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={clsx(
        {
          'bg-blue-500 hover:bg-blue-600 border border-blue-600 text-white':
            !outline && variant === 'primary',
          'bg-green-500 hover:bg-green-400 border border-green-600 text-white':
            !outline && variant === 'success',
          'bg-red-500 hover:bg-red-400 border border-red-600 text-white':
            !outline && variant === 'danger',
          'border border-blue-500 text-blue-500 hover:bg-blue-100':
            outline && variant === 'primary',
          'border border-green-500 text-green-500 hover:bg-green-100':
            outline && variant === 'success',
          'border border-red-500 text-red-500 hover:bg-red-100':
            outline && variant === 'danger',
          'px-2 py-0.5': size === 'sm',
          'px-3 py-1': size === 'md',
          'px-4 py-1.5': size === 'lg'
        },
        'rounded-lg font-bold disabled:opacity-50',
        className
      )}
      disabled={loading}
      {...rest}
    >
      {children}
    </button>
  )
})

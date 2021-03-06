import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export const SuccessMessage: React.FC<Props> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`rounded-lg bg-green-50 dark:bg-green-900 dark:bg-opacity-10 border-2 border-green-500 border-opacity-50 p-4 ${className}`}
    >
      <div className="text-sm text-green-700 dark:text-green-200">
        {children}
      </div>
    </div>
  )
}

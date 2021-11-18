import React from 'react'

export const SiteLoading: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <img
          className="block h-10 sm:h-16 w-auto"
          src="/logo.svg"
          alt="Devparty"
        />
      </div>
    </div>
  )
}

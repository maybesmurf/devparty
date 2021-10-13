import { Button } from '@components/ui/Button'
import mixpanel from 'mixpanel-browser'
import { useTheme } from 'next-themes'
import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

const LoginWithGitHub: React.FC = () => {
  const { resolvedTheme } = useTheme()

  return (
    <a href="/api/auth/github">
      <Button
        size="lg"
        type="button"
        variant="success"
        onClick={() => mixpanel.track('login.github.click')}
        className="w-full justify-center text-[#0d1117] dark:text-white border-[#0d1117] dark:border-white hover:bg-[#dadada] focus:ring-[#0d1117]"
        icon={
          <img
            src={`${STATIC_ASSETS}/brands/${
              resolvedTheme === 'dark' ? 'github-light' : 'github-dark'
            }.svg`}
            className="h-4 w-4"
            alt="GitHub Logo"
          />
        }
        outline
      >
        GitHub
      </Button>
    </a>
  )
}

export default LoginWithGitHub

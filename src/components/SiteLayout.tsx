import { gql, useQuery } from '@apollo/client'
import { CurrentUserQuery, User } from '@graphql/types.generated'
import Head from 'next/head'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

import MobileFooter from './shared/MobileFooter'
import Navbar from './shared/Navbar'
import AppContext from './utils/AppContext'

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    me {
      id
      username
      isStaff
      spammy
      masquerading
      profile {
        id
        avatar
      }
      status {
        emoji
        text
      }
    }
  }
`

interface Props {
  children: React.ReactNode
}

const SiteLayout: React.FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme()
  const toastOptions = {
    style: {
      background: resolvedTheme === 'dark' ? '#18181B' : '',
      color: resolvedTheme === 'dark' ? '#fff' : ''
    },
    success: {
      className: 'border border-green-500',
      iconTheme: {
        primary: '#10B981',
        secondary: 'white'
      }
    },
    error: {
      className: 'border border-red-500',
      iconTheme: {
        primary: '#EF4444',
        secondary: 'white'
      }
    },
    loading: { className: 'border border-gray-300' }
  }
  const { data, loading, error } =
    useQuery<CurrentUserQuery>(CURRENT_USER_QUERY)
  const [staffMode, setStaffMode] = useState<boolean>()

  useEffect(() => {
    setStaffMode(localStorage.staffMode === 'true')
  }, [])

  const injectedGlobalContext = {
    currentUser: data?.me as User,
    currentUserLoading: loading,
    currentUserError: error,
    staffMode,
    setStaffMode
  }

  return (
    <AppContext.Provider value={injectedGlobalContext}>
      <Head>
        <meta
          name="theme-color"
          content={resolvedTheme === 'dark' ? '#1b1b1d' : '#ffffff'}
        />
      </Head>
      <Toaster position="top-right" toastOptions={toastOptions} />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
        {data?.me && <MobileFooter />}
      </div>
    </AppContext.Provider>
  )
}

export default SiteLayout

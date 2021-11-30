import Slug from '@components/shared/Slug'
import { Log } from '@graphql/types.generated'
import {
  CogIcon,
  FingerPrintIcon,
  LoginIcon,
  LogoutIcon
} from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import React from 'react'
import * as timeago from 'timeago.js'

interface Props {
  log: Log
}

const SingleLog: React.FC<Props> = ({ log }) => {
  return (
    <div className="border dark:border-gray-700 p-3 rounded-lg flex items-center space-x-3">
      <img
        className="h-7 w-7 rounded-full"
        src={log?.user?.profile?.avatar}
        alt={`@${log?.user?.username}`}
      />
      <div className="space-y-1">
        <div className="flex items-center space-x-1">
          <Slug slug={formatUsername(log?.user?.username)} prefix="@" />
          <div>–</div>
          <div className="text-sm font-bold">{log?.action}</div>
        </div>
        <div className="linkify">
          {log?.action === 'SETTINGS_UPDATE' && (
            <div className="flex items-center space-x-1">
              <CogIcon className="h-4 w-4 text-gray-500" />
              <div>updated user settings</div>
            </div>
          )}
          {log?.action === 'PASSWORD_UPDATE' && (
            <div className="flex items-center space-x-1">
              <FingerPrintIcon className="h-4 w-4 text-gray-500" />
              <div>updated the password</div>
            </div>
          )}
          {log?.action === 'LOGIN' && (
            <div className="flex items-center space-x-1">
              <LoginIcon className="h-4 w-4 text-gray-500" />
              <div>logged in</div>
            </div>
          )}
          {log?.action === 'LOGOUT' && (
            <div className="flex items-center space-x-1">
              <LogoutIcon className="h-4 w-4 text-gray-500" />
              <div>logged out</div>
            </div>
          )}
        </div>
        <div className="text-sm">{timeago.format(log?.createdAt)}</div>
      </div>
    </div>
  )
}

export default SingleLog

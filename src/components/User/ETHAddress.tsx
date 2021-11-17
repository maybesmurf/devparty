import { formatUsername } from '@components/utils/formatUsername'
import Davatar from '@davatar/react'
import { User } from '@graphql/types.generated'
import { DuplicateIcon } from '@heroicons/react/outline'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'

interface Props {
  user: User
}

const ETHAddress: React.FC<Props> = ({ user }) => {
  return (
    <CopyToClipboard
      text={user?.integrations?.ethAddress as string}
      onCopy={() => {
        toast.success('Ethereum address copied!')
      }}
    >
      <div className="flex items-center space-x-1.5 bg-white dark:bg-gray-800 shadown-sm rounded-full border dark:border-gray-700 text-xs px-3 py-1 w-max cursor-pointer">
        <Davatar
          size={15}
          address={user?.integrations?.ethAddress as string}
          generatedAvatarType="jazzicon"
        />
        <div>{formatUsername(user?.integrations?.ensAddress as string)}</div>
        <DuplicateIcon className="h-4 w-4" />
      </div>
    </CopyToClipboard>
  )
}

export default ETHAddress

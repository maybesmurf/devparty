import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { User } from '@graphql/types.generated'
import { CashIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/utilities'
import { useState } from 'react'

import TipsDetails from './TipsDetails'

interface Props {
  user: User
}

const Tips: React.FC<Props> = ({ user }) => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div>
      <Button
        className="text-sm"
        icon={<CashIcon className="h-4 w-4" />}
        outline
        onClick={() => setShowModal(!showModal)}
      >
        Tip
      </Button>
      {showModal && (
        <Modal
          onClose={() => setShowModal(!showModal)}
          title={
            <div className="flex items-center space-x-1.5">
              <div>Send dev tips to</div>
              <Slug slug={formatUsername(user?.username)} prefix="@" />
            </div>
          }
          show={showModal}
        >
          <TipsDetails user={user} />
        </Modal>
      )}
    </div>
  )
}

export default Tips

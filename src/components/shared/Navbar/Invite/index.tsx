import { TicketIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import { Button } from '~/components/ui/Button'
import { Modal } from '~/components/ui/Modal'

import InviteDetails from './InviteDetails'

const Invite: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  return (
    <div>
      <Button
        className="flex items-center space-x-1 text-xs"
        onClick={() => setShowModal(!showModal)}
      >
        <TicketIcon className="h-4 w-4" />
        <div>Invite</div>
      </Button>
      {showModal && (
        <Modal
          onClose={() => setShowModal(!showModal)}
          title="Your Invite Code"
        >
          <InviteDetails />
        </Modal>
      )}
    </div>
  )
}

export default Invite
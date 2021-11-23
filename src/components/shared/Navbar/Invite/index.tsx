import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { TicketIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import InviteDetails from './InviteDetails'

const Invite: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  return (
    <div>
      <Button
        className="text-xs"
        icon={<TicketIcon className="h-4 w-4" />}
        onClick={() => setShowModal(!showModal)}
      >
        Invite
      </Button>
      <Modal
        title="Your Invite Code"
        show={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <InviteDetails />
      </Modal>
    </div>
  )
}

export default Invite

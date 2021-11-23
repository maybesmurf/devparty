import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { CashIcon } from '@heroicons/react/outline'
import { useState } from 'react'

import TierForm from './Form'

const Tier: React.FC = () => {
  const [showTierModal, setShowTierModal] = useState<boolean>(false)

  return (
    <div>
      <Button
        variant="success"
        type="button"
        icon={<CashIcon className="h-4 w-4" />}
        onClick={() => setShowTierModal(!showTierModal)}
      >
        Add Tiers
      </Button>
      <Modal
        size="lg"
        title="Tip Tier Settings"
        show={showTierModal}
        onClose={() => setShowTierModal(!showTierModal)}
      >
        <TierForm />
      </Modal>
    </div>
  )
}

export default Tier

import { Modal } from '@components/UI/Modal'
import { User } from '@graphql/types.generated'
import { humanize } from '@lib/humanize'
import React, { useState } from 'react'

import Following from './Following'

interface Props {
  user: User
}

const Followerings: React.FC<Props> = ({ user }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)

  return (
    <div className="flex gap-5">
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
      >
        <div className="text-xl">{humanize(user?.following?.totalCount)}</div>
        <div className="text-gray-500">Following</div>
      </div>
      <div>
        <div className="text-xl">{humanize(user?.followers?.totalCount)}</div>
        <div className="text-gray-500">Followers</div>
      </div>
      <Modal
        title="Following"
        size="lg"
        show={showFollowingModal}
        onClose={() => setShowFollowingModal(!showFollowingModal)}
      >
        <Following />
      </Modal>
    </div>
  )
}

export default Followerings

import { Modal } from '@components/UI/Modal'
import { User } from '@graphql/types.generated'
import { humanize } from '@lib/humanize'
import React, { useState } from 'react'

import Followers from './Followers'
import Following from './Following'

interface Props {
  user: User
}

const Followerings: React.FC<Props> = ({ user }) => {
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false)
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false)

  return (
    <div className="flex gap-5">
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowingModal(!showFollowingModal)}
      >
        <div className="text-xl">{humanize(user?.following?.totalCount)}</div>
        <div className="text-gray-500">Following</div>
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setShowFollowersModal(!showFollowersModal)}
      >
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
      <Modal
        title="Followers"
        size="lg"
        show={showFollowersModal}
        onClose={() => setShowFollowersModal(!showFollowersModal)}
      >
        <Followers />
      </Modal>
    </div>
  )
}

export default Followerings

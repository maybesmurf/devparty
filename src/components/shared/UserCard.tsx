import { Card, CardBody } from '@components/UI/Card'
import Follow from '@components/User/Follow'
import AppContext from '@components/utils/AppContext'
import React, { useContext } from 'react'
import { User } from 'src/__generated__/schema.generated'

import UserProfile from './UserProfile'

interface Props {
  user: User
}

const UserCard: React.FC<Props> = ({ user }) => {
  const { currentUser } = useContext(AppContext)

  return (
    <Card>
      <CardBody className="space-y-3">
        <UserProfile user={user} />
        {user?.profile?.bio && <div>{user?.profile?.bio}</div>}
        {currentUser && <Follow user={user} showText />}
      </CardBody>
    </Card>
  )
}

export default UserCard

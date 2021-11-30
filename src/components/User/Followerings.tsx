import { User } from '@graphql/types.generated'
import { humanize } from '@lib/humanize'
import Link from 'next/link'
import React from 'react'

interface Props {
  user: User
}

const Followerings: React.FC<Props> = ({ user }) => {
  return (
    <div className="flex gap-5">
      <Link href={`/u/${user?.username}/following`} passHref>
        <a href={`/u/${user?.username}/following`}>
          <div className="text-xl">{humanize(user?.following?.totalCount)}</div>
          <div className="text-gray-500">Following</div>
        </a>
      </Link>
      <Link href={`/u/${user?.username}/followers`} passHref>
        <a href={`/u/${user?.username}/followers`}>
          <div className="text-xl">{humanize(user?.followers?.totalCount)}</div>
          <div className="text-gray-500">Followers</div>
        </a>
      </Link>
    </div>
  )
}

export default Followerings

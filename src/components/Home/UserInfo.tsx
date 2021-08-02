import { gql } from '@apollo/client'
import Link from 'next/link'
import { User } from '~/__generated__/schema.generated'

export const UserInfoFragment = gql`
  fragment UserInfo_user on User {
    id
    username
  }
`

interface Props {
  user: User
}

export function UserInfo({ user }: Props) {
  return (
    <>
      <h3 className="text-center font-bold text-xl">
        Welcome, {user.username}!
      </h3>
      <a href="/posts">View Your Posts</a>
      <div className="grid grid-cols-2 gap-2 text-center">
        <Link href="/settings">Edit Profile</Link>
      </div>
    </>
  )
}

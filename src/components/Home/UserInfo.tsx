import { gql, useMutation } from '@apollo/client'
import { Button } from '../ui/Button'
import { Link } from '../ui/Link'
import { useAuthRedirect } from '../utils/useAuthRedirect'
import { UserInfo_User } from './__generated__/UserInfo.generated'

export const UserInfoFragment = gql`
  fragment UserInfo_user on User {
    id
    name
  }
`

interface Props {
  user: UserInfo_User
}

export function UserInfo({ user }: Props) {
  const authRedirect = useAuthRedirect()
  const [logout] = useMutation(
    gql`
      mutation UserInfoLogoutMutation {
        logout
      }
    `,
    {
      onCompleted() {
        authRedirect()
      }
    }
  )

  return (
    <>
      <h3 className="text-center font-bold text-xl">Welcome, {user.name}!</h3>
      <Button href="/posts">View Your Posts</Button>
      <div className="grid grid-cols-2 gap-2 text-center">
        <Link href="/profile">Edit Profile</Link>

        <Link onClick={() => logout()}>Logout</Link>
      </div>
    </>
  )
}

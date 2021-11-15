import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import {
  Community,
  ToggleCommunityJoinMutation,
  ToggleCommunityJoinMutationVariables
} from '@graphql/types.generated'
import { Switch } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'

interface Props {
  community: Community
  showText: boolean
}

const Join: React.FC<Props> = ({ community, showText }) => {
  const { currentUser } = useContext(AppContext)
  const router = useRouter()
  const [isJoined, setIsJoined] = useState<boolean>(false)
  const [toggleCommunityJoin] = useMutation<
    ToggleCommunityJoinMutation,
    ToggleCommunityJoinMutationVariables
  >(
    gql`
      mutation ToggleCommunityJoin($input: ToggleCommunityJoinInput!) {
        toggleCommunityJoin(input: $input) {
          id
          slug
          hasJoined
        }
      }
    `,
    {
      onError() {
        toast.error(ERROR_MESSAGE)
      },
      onCompleted(data) {
        if (data?.toggleCommunityJoin?.hasJoined) {
          toast.success(
            `Successfully joined to ${data?.toggleCommunityJoin?.slug}`
          )
        } else {
          toast.success(`Successfully left ${data?.toggleCommunityJoin?.slug}`)
        }
      }
    }
  )

  useEffect(() => {
    if (community?.hasJoined) setIsJoined(community?.hasJoined)
  }, [community])

  const handleToggleSubscribe = () => {
    if (!currentUser)
      return router.push({
        pathname: '/login',
        query: { redirect: `/communities/${community?.slug}` }
      })
    toggleCommunityJoin({
      variables: {
        input: { id: community?.id }
      }
    })
  }

  return (
    <Switch
      as={Button}
      checked={isJoined}
      onChange={() => {
        setIsJoined(!isJoined)
        handleToggleSubscribe()
      }}
      variant={isJoined ? 'danger' : 'success'}
      icon={
        isJoined ? (
          <MinusIcon className="h-4 w-4" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )
      }
      outline
    >
      {isJoined ? showText && 'Leave' : showText && 'Join'}
    </Switch>
  )
}

export default Join

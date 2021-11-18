import { gql, useMutation } from '@apollo/client'
import {
  DeletePostMutation,
  DeletePostMutationVariables,
  Post
} from '@graphql/types.generated'
import { Menu } from '@headlessui/react'
import { TrashIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {
  post: Post
}

const Delete: React.FC<Props> = ({ post }) => {
  const router = useRouter()
  const [deletePost] = useMutation<
    DeletePostMutation,
    DeletePostMutationVariables
  >(
    gql`
      mutation DeletePost($input: DeletePostInput!) {
        deletePost(input: $input)
      }
    `,
    {
      onCompleted() {
        if (process.browser) router.push('/login')
      }
    }
  )

  return (
    <Menu.Item
      as="div"
      className={({ active }: { active: boolean }) =>
        clsx(
          { 'bg-gray-100 dark:bg-gray-800': active },
          'block px-4 py-1.5 text-sm text-red-500 m-2 rounded-lg cursor-pointer'
        )
      }
      onClick={() => deletePost({ variables: { input: { id: post?.id } } })}
    >
      <div className="flex items-center space-x-2">
        <TrashIcon className="h-4 w-4" />
        <div>Delete</div>
      </div>
    </Menu.Item>
  )
}

export default Delete

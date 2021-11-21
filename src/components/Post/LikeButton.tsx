import AppContext from '@components/utils/AppContext'
import { humanize } from '@components/utils/humanize'
import { Post } from '@graphql/types.generated'
import { Switch } from '@headlessui/react'
import { HeartIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

type Props = {
  entity: Post
  // eslint-disable-next-line no-unused-vars
  handleLike: (post: Post) => void
}

const LikeButton: React.FC<Props> = ({ entity, handleLike }) => {
  const { currentUser } = useContext(AppContext)
  const router = useRouter()
  const [likesCount, setLikesCount] = useState<number>(
    entity?.likes?.totalCount
  )
  const [isLiked, setIsLiked] = useState<boolean>(false)

  useEffect(() => {
    if (entity?.hasLiked) setIsLiked(entity?.hasLiked)
  }, [entity])

  const toggleLike = () => {
    if (!currentUser)
      return router.push({
        pathname: '/login',
        query: { redirect: `/posts/${entity?.id}` }
      })
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
    handleLike(entity)
  }

  return (
    <div className="text-pink-500 hover:text-pink-400 flex items-center space-x-1">
      <Switch
        as="div"
        checked={entity?.hasLiked}
        onChange={toggleLike}
        className="hover:bg-pink-300 hover:bg-opacity-20 p-1.5 rounded-full"
      >
        {isLiked ? (
          <HeartIconSolid className="h-5 w-5" />
        ) : (
          <HeartIcon className="h-5 w-5" />
        )}
      </Switch>
      {likesCount > 0 && <div className="text-xs">{humanize(likesCount)}</div>}
    </div>
  )
}

export default LikeButton

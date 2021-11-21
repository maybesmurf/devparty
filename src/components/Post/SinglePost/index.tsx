import { gql, useMutation } from '@apollo/client'
import Slug from '@components/shared/Slug'
import UserProfile from '@components/shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { formatUsername } from '@components/utils/formatUsername'
import { useOembed } from '@components/utils/hooks/useOembed'
import { humanize } from '@components/utils/humanize'
import { imagekitURL } from '@components/utils/imagekitURL'
import {
  Post,
  TogglePostLikeMutation,
  TogglePostLikeMutationVariables,
  User
} from '@graphql/types.generated'
import { ChatAlt2Icon, SparklesIcon } from '@heroicons/react/outline'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import * as timeago from 'timeago.js'

import LikeButton from '../LikeButton'
import PostMenu from './Menu'
import Oembed from './Oembed'
import SelectedCommunity from './SelectedCommunity'
import SelectedProduct from './SelectedProduct'
import IssueType from './Type/Issue'
import PollType from './Type/Poll'
import PostType from './Type/Post'
import QuestionType from './Type/Question'
import TaskType from './Type/Task'
import ViewNFT from './ViewNFT'

const Mint = dynamic(() => import('./Mint'), {
  loading: () => (
    <div className="p-5 font-bold text-center space-y-2 border-t dark:border-gray-700">
      <Spinner size="md" className="mx-auto" />
      <div>Get ready to mint your NFT!</div>
    </div>
  )
})

export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    title
    body
    done
    type
    oembedUrl
    hasLiked
    hasBookmarked
    createdAt
    parent {
      id
      user {
        id
        username
      }
    }
    attachments {
      id
      url
    }
    replies {
      totalCount
    }
    likes(first: 5) {
      totalCount
      edges {
        node {
          user {
            id
            username
            profile {
              id
              avatar
            }
          }
        }
      }
    }
    user {
      id
      username
      hasFollowed
      isVerified
      profile {
        id
        name
        avatar
        bio
      }
      status {
        emoji
        text
      }
    }
    product {
      id
      name
      slug
      avatar
    }
    community {
      id
      name
      slug
      avatar
    }
    nft {
      id
      address
      tokenId
      network
    }
  }
`

interface Props {
  post: Post
  showParent?: boolean
  showMint?: boolean
}

const SinglePost: React.FC<Props> = ({
  post,
  showParent = false,
  showMint = false
}) => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { oembed, isLoading, isError } = useOembed(post?.oembedUrl)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [showMintForm, setShowMintForm] = useState<boolean>(false)
  const [togglePostLike] = useMutation<
    TogglePostLikeMutation,
    TogglePostLikeMutationVariables
  >(
    gql`
      mutation TogglePostLike($input: TogglePostLikeInput!) {
        togglePostLike(input: $input) {
          id
        }
      }
      ${PostFragment}
    `,
    {
      onError(error) {
        toast.error(error.message)
      }
    }
  )

  const handleLike = (post: Post) => {
    togglePostLike({
      variables: {
        input: { id: post?.id }
      }
    })
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        {!post?.parent &&
          post?.type === 'REPLY' &&
          router.pathname === '/posts/[postId]' && (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Post author deleted the parent post
            </div>
          )}
        {post?.parent && showParent && (
          <div className="text-sm flex space-x-1">
            <Link href={`/posts/${post?.parent?.id}`} passHref>
              <a
                href={`/posts/${post?.parent?.id}`}
                className="text-gray-500 dark:text-gray-400"
              >
                Replying to
              </a>
            </Link>
            <Link href={`/u/${post?.parent?.user?.username}`} passHref>
              <a href={`/u/${post?.parent?.user?.username}`}>
                <Slug
                  slug={formatUsername(post?.parent?.user?.username)}
                  prefix="@"
                />
              </a>
            </Link>
          </div>
        )}
        <div className="flex justify-between">
          <UserProfile user={post?.user as User} />
          <Link href={`/posts/${post?.id}`} passHref>
            <a href={`/posts/${post?.id}`} className="text-sm cursor-pointer">
              {timeago.format(post?.createdAt)}
            </a>
          </Link>
        </div>
        {post?.type === 'POST' && <PostType post={post} />}
        {post?.type === 'REPLY' && <PostType post={post} />}
        {post?.type === 'TASK' && <TaskType task={post} />}
        {post?.type === 'QUESTION' && <QuestionType question={post} />}
        {post?.type === 'POLL' && <PollType post={post} />}
        {post?.type === 'ISSUE' && <IssueType post={post} />}
        {post?.type !== 'ISSUE' &&
          post?.oembedUrl &&
          !isLoading &&
          !isError && <Oembed url={post?.oembedUrl} oembed={oembed} />}
      </CardBody>
      <div className="flex px-3 py-1.5 space-x-4 border-t dark:border-gray-800">
        <motion.button whileTap={{ scale: 0.9 }}>
          <LikeButton entity={post} handleLike={handleLike} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }}>
          <Link href={`/posts/${post?.id}`} passHref>
            <a
              href={`/posts/${post?.id}`}
              className="text-blue-500 hover:text-blue-400 flex items-center space-x-1"
            >
              <div className="hover:bg-blue-300 hover:bg-opacity-20 p-1.5 rounded-full">
                <ChatAlt2Icon className="h-5 w-5" />
              </div>
              {(post?.replies?.totalCount as number) > 0 && (
                <div className="text-xs">
                  {humanize(post?.replies?.totalCount)}
                </div>
              )}
            </a>
          </Link>
        </motion.button>
        {showMint &&
          !isMinting &&
          currentUser?.id === post?.user?.id &&
          !post?.nft &&
          post?.type === 'POST' && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="text-purple-500 hover:text-purple-400 flex items-center space-x-1"
              onClick={() => setShowMintForm(!showMintForm)}
            >
              <div className="hover:bg-purple-300 hover:bg-opacity-20 p-1.5 rounded-full">
                <SparklesIcon className="h-5 w-5" />
              </div>
            </motion.button>
          )}
        <PostMenu post={post} />
        {(post?.likes?.totalCount as number) > 0 && (
          <div className="text-gray-600 dark:text-gray-400 text-sm items-center gap-2 hidden sm:flex">
            <div>Liked by</div>
            <div className="flex -space-x-1.5 overflow-hidden">
              {post?.likes?.edges?.map((like) => (
                <Link
                  key={like?.node?.user?.id}
                  href={`/u/${like?.node?.user?.username}`}
                  passHref
                >
                  <a href={`/u/${like?.node?.user?.username}`}>
                    <img
                      className="rounded-full border h-5 w-5"
                      src={imagekitURL(
                        like?.node?.user?.profile?.avatar as string,
                        50,
                        50
                      )}
                      alt={`@${like?.node?.user?.username}`}
                    />
                  </a>
                </Link>
              ))}
            </div>
            {(post?.likes?.totalCount as number) > 5 && (
              <div>
                and {humanize((post?.likes?.totalCount as number) - 5)}{' '}
                others...
              </div>
            )}
          </div>
        )}
        <div className="!ml-auto flex items-center space-x-3">
          {post?.product && <SelectedProduct product={post?.product} />}
          {post?.community && <SelectedCommunity community={post?.community} />}
          {post?.nft && <ViewNFT nft={post?.nft} />}
        </div>
      </div>
      {showMint && showMintForm && (
        <Mint
          setShowMintForm={setShowMintForm}
          setIsMinting={setIsMinting}
          post={post}
        />
      )}
    </Card>
  )
}

export default SinglePost

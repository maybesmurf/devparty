import { gql, useQuery } from '@apollo/client'
import { PostFragment } from '@components/Post/SinglePost'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { GetNotificationsQuery } from '@graphql/types.generated'
import { BellIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import useInView from 'react-cool-inview'

import NotificationType from './NotificationType'
import PostLike from './type/PostLike'
import PostReply from './type/PostReply'
import ProductSubscribe from './type/ProductSubscribe'
import UserFollow from './type/UserFollow'
import UserMention from './type/UserMention'

export const GET_NOTIFICATIONS_QUERY = gql`
  query GetNotifications($after: String, $isRead: Boolean) {
    notifications(first: 5, after: $after, isRead: $isRead) {
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          id
          type
          createdAt
          # User
          dispatcher {
            id
            username
            hasFollowed
            profile {
              id
              name
              avatar
            }
          }
          # Like
          like {
            id
            post {
              ...PostFragment
            }
          }
          # Post
          post {
            ...PostFragment
          }
          # Product
          product {
            id
            slug
            name
            description
            avatar
            hasSubscribed
          }
        }
      }
    }
  }
  ${PostFragment}
`

const Notifications: React.FC = () => {
  const [isRead, setIsRead] = useState<boolean>(false)
  const { data, loading, error, fetchMore } = useQuery<GetNotificationsQuery>(
    GET_NOTIFICATIONS_QUERY,
    { variables: { after: null, isRead } }
  )
  const notifications = data?.notifications?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.notifications?.pageInfo

  const { observe } = useInView({
    threshold: 1,
    onChange: ({ observe, unobserve }) => {
      unobserve()
      observe()
    },
    onEnter: () => {
      if (pageInfo?.hasNextPage) {
        fetchMore({
          variables: {
            after: pageInfo?.endCursor ? pageInfo?.endCursor : null
          }
        })
      }
    }
  })

  if (loading) return <PageLoading message="Loading notifications" />

  return (
    <div className="flex flex-grow justify-center px-0 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl w-full space-y-3">
        <NotificationType isRead={isRead} setIsRead={setIsRead} />
        <div className="space-y-5">
          <ErrorMessage title="Failed to notifications" error={error} />
          {notifications?.length === 0 ? (
            <EmptyState
              message="Congratulations, you have read all your notifications."
              icon={<BellIcon className="h-8 w-8 text-brand-500" />}
            />
          ) : (
            <div className="space-y-4">
              {notifications?.map((notification: any) => (
                <div key={notification?.id}>
                  {notification?.type === 'POST_LIKE' && (
                    <PostLike notification={notification} />
                  )}
                  {notification?.type === 'POST_REPLY' && (
                    <PostReply notification={notification} />
                  )}
                  {notification?.type === 'USER_FOLLOW' && (
                    <UserFollow notification={notification} />
                  )}
                  {notification?.type === 'USER_INVITE_FOLLOW' && (
                    <UserFollow
                      notification={notification}
                      followedVia="INVITE"
                    />
                  )}
                  {notification?.type === 'USER_MENTION' && (
                    <UserMention notification={notification} />
                  )}
                  {notification?.type === 'PRODUCT_SUBSCRIBE' && (
                    <ProductSubscribe notification={notification} />
                  )}
                </div>
              ))}
            </div>
          )}
          {pageInfo?.hasNextPage && (
            <span ref={observe} className="flex justify-center p-5">
              <Spinner size="md" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notifications

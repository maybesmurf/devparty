import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import {
  GetStaffUsersQuery,
  OnboardUserMutation,
  OnboardUserMutationVariables
} from '@graphql/types.generated'
import { humanize } from '@lib/humanize'
import React from 'react'
import useInView from 'react-cool-inview'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, STATIC_ASSETS } from 'src/constants'
import * as timeago from 'timeago.js'

import Sidebar from './Sidebar'

export const GET_STAFF_USERS_QUERY = gql`
  query GetStaffUsers($after: String) {
    users(first: 5, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          username
          email
          inWaitlist
          isVerified
          hasFollowed
          hasSpotifyIntegration
          hasWakatimeIntegration
          followers {
            totalCount
          }
          following {
            totalCount
          }
          createdAt
          updatedAt
          invite {
            id
            code
            usedTimes
          }
          profile {
            id
            name
            bio
            avatar
          }
          status {
            emoji
            text
          }
          integrations {
            githubId
            ethAddress
          }
        }
      }
    }
  }
`

const StaffToolsUsers: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<GetStaffUsersQuery>(
    GET_STAFF_USERS_QUERY,
    {
      variables: {
        after: null
      },
      pollInterval: 10000
    }
  )
  const users = data?.users?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.users?.pageInfo

  const [onboardUser] = useMutation<
    OnboardUserMutation,
    OnboardUserMutationVariables
  >(
    gql`
      mutation OnboardUser($input: OnboardUserInput!) {
        onboardUser(input: $input) {
          id
          inWaitlist
        }
      }
    `,
    {
      onError() {
        toast.error(ERROR_MESSAGE)
      },
      onCompleted() {
        toast.success('Successfully onboarded the user')
      }
    }
  )

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

  if (loading) return <PageLoading message="Loading users" />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-4">
            <ErrorMessage title="Failed to load users" error={error} />
            {users?.map((user: any) => (
              <div key={user?.id}>
                <UserProfileLarge user={user} showFollow />
                <div className="border-b border-gray-200 dark:border-gray-800 mt-4" />
                <div className="my-3 flex items-center justify-between">
                  <div className="flex space-x-3 text-gray-600 dark:text-gray-300 divide-x dark:divide-gray-800">
                    <div className="text-sm">
                      <div>
                        Created: <b>{timeago.format(user?.createdAt)}</b>
                      </div>
                      <div>
                        Updated: <b>{timeago.format(user?.updatedAt)}</b>
                      </div>
                      <div className="flex space-x-1">
                        <span>Invited:</span>
                        <Tooltip content={user?.invite?.code}>
                          <b>{user?.invite?.usedTimes} people</b>
                        </Tooltip>
                      </div>
                      <div>
                        Following:{' '}
                        <b>{humanize(user?.following?.totalCount)}</b>
                      </div>
                      <div>
                        Followers:{' '}
                        <b>{humanize(user?.followers?.totalCount)}</b>
                      </div>
                    </div>
                    <div className="text-sm pl-3">
                      {user?.email && (
                        <div>
                          Email: <b>{user?.email}</b>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <div>Integrations:</div>
                        <div className="flex items-center space-x-1.5">
                          {!user?.hasSpotifyIntegration &&
                            !user?.hasWakatimeIntegration &&
                            !user?.integrations?.githubId &&
                            !user?.integrations?.ethAddress && <div>None</div>}
                          {user?.hasSpotifyIntegration && (
                            <img
                              className="h-4 w-4"
                              src={`${STATIC_ASSETS}/brands/spotify.svg`}
                              alt="Spotify Logo"
                            />
                          )}
                          {user?.hasWakatimeIntegration && (
                            <img
                              className="h-4 w-4"
                              src={`${STATIC_ASSETS}/brands/wakatime-dark.svg`}
                              alt="Wakatime Logo"
                            />
                          )}
                          {user?.hasWakatimeIntegration && (
                            <img
                              className="h-4 w-4"
                              src={`${STATIC_ASSETS}/brands/wakatime-dark.svg`}
                              alt="Wakatime Logo"
                            />
                          )}
                          {user?.integrations?.githubId && (
                            <Tooltip content={user?.integrations?.githubId}>
                              <img
                                className="h-4 w-4"
                                src={`${STATIC_ASSETS}/brands/github-dark.svg`}
                                alt="GitHub Logo"
                              />
                            </Tooltip>
                          )}
                          {user?.integrations?.ethAddress && (
                            <Tooltip content={user?.integrations?.ethAddress}>
                              <img
                                className="h-4 w-4"
                                src={`${STATIC_ASSETS}/brands/metamask.svg`}
                                alt="MetaMask Logo"
                              />
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {user?.inWaitlist && (
                    <div>
                      <Button
                        size="sm"
                        className="text-sm"
                        onClick={() =>
                          onboardUser({
                            variables: { input: { userId: user?.id } }
                          })
                        }
                      >
                        Onboard user
                      </Button>
                    </div>
                  )}
                </div>
                <div className="border-b border-gray-200 dark:border-gray-800" />
              </div>
            ))}
          </CardBody>
        </Card>
        {pageInfo?.hasNextPage && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </GridItemEight>
    </GridLayout>
  )
}

export default StaffToolsUsers

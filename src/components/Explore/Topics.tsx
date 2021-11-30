import { gql, useQuery } from '@apollo/client'
import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Tooltip } from '@components/UI/Tooltip'
import { formatUsername } from '@components/utils/formatUsername'
import { GetExploreUserQuery } from '@graphql/types.generated'
import {
  BadgeCheckIcon,
  LoginIcon,
  UserAddIcon
} from '@heroicons/react/outline'
import { humanize } from '@lib/humanize'
import { imagekitURL } from '@lib/imagekitURL'
import Link from 'next/link'
import React from 'react'

export const GET_EXPLORE_USER_QUERY = gql`
  query GetExploreUser {
    me {
      id
      username
      isVerified
      profile {
        id
        name
        avatar
      }
      status {
        emoji
        text
      }
      topics(first: 5) {
        totalCount
        edges {
          node {
            id
            name
            image
          }
        }
      }
    }
  }
`

const Topics: React.FC = () => {
  const { data, loading, error } = useQuery<GetExploreUserQuery>(
    GET_EXPLORE_USER_QUERY
  )
  const user = data?.me

  if (loading)
    return (
      <Card className="mb-4">
        <CardBody>
          <div className="shimmer h-5 rounded-lg" />
        </CardBody>
      </Card>
    )

  return (
    <>
      {user ? (
        <Card className="mb-4">
          <ErrorMessage
            title="Failed to load topics"
            error={error}
            className="p-5"
          />
          <div className="space-y-3 text-center p-5">
            <img
              className="h-16 w-16 rounded-full mx-auto"
              src={imagekitURL(user?.profile?.avatar as string, 100, 100)}
              alt={`@${user?.username}`}
            />
            <div>
              <Link href={`/u/${user?.username}`} passHref>
                <a
                  href={`/u/${user?.username}`}
                  className="font-bold cursor-pointer flex items-center space-x-1 justify-center"
                >
                  <div className="font-bold text-lg">{user?.profile?.name}</div>
                  {user?.isVerified && (
                    <Tooltip content={'Verified'}>
                      <BadgeCheckIcon className="h-4 w-4 text-brand-500" />
                    </Tooltip>
                  )}
                  {user?.status?.emoji && (
                    <Tooltip content={user?.status?.text}>
                      <div className="text-xs">{user?.status?.emoji}</div>
                    </Tooltip>
                  )}
                </a>
              </Link>
              <Slug slug={formatUsername(user?.username)} prefix="@" />
            </div>
          </div>
          <div className="border-b dark:border-gray-800" />
          <div className="p-5 space-y-3">
            <div className="font-bold">
              {humanize(user?.topics?.totalCount)} starred topics
            </div>
            {user?.topics?.totalCount > 0 && (
              <div className="space-y-3">
                {user?.topics?.edges?.map((topic: any) => (
                  <div
                    key={topic?.node?.id}
                    className="flex items-center space-x-2"
                  >
                    {topic?.node?.image ? (
                      <img
                        className="h-7 w-7 rounded-md"
                        src={imagekitURL(topic?.node?.image, 80, 80)}
                        alt={`#${topic?.node?.name}'s'`}
                      />
                    ) : (
                      <div className="flex items-center justify-around h-7 w-7 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                        <div>#</div>
                      </div>
                    )}
                    <Link href={`/topics/${topic?.node?.name}`} passHref>
                      <a href={`/topics/${topic?.node?.name}`}>
                        {topic?.node?.name}
                      </a>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <Card className="mb-4">
          <CardBody className="space-y-3">
            <div>Join Devparty today!</div>
            <div className="flex space-x-1.5">
              <Link href="/login" passHref>
                <a href="/login">
                  <Button icon={<LoginIcon className="h-4 w-4" />}>
                    Login
                  </Button>
                </a>
              </Link>
              <Link href="/signup" passHref>
                <a href="/signup">
                  <Button
                    variant="success"
                    icon={<UserAddIcon className="h-4 w-4" />}
                  >
                    Signup
                  </Button>
                </a>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}
    </>
  )
}

export default Topics

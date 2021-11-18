import { gql, useQuery } from '@apollo/client'
import UserProfileLargeShimmer from '@components/shared/Shimmer/UserProfileLargeShimmer'
import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { ProgressBar } from '@components/UI/ProgressBar'
import { GetOnboardingUsersQuery, User } from '@graphql/types.generated'
import {
  ArrowCircleRightIcon,
  ArrowLeftIcon,
  UsersIcon
} from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export const GET_ONBOARDING_USERS_QUERY = gql`
  query GetOnboardingUsers($after: String) {
    suggestedUsers(first: 30, after: $after) {
      edges {
        node {
          id
          username
          isVerified
          hasFollowed
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
      }
    }
  }
`

const Follow: React.FC = () => {
  const router = useRouter()
  const [showSkip, setShowSkip] = useState<boolean>(true)
  const { data, loading, error } = useQuery<GetOnboardingUsersQuery>(
    GET_ONBOARDING_USERS_QUERY,
    { variables: { after: null } }
  )
  const users = data?.suggestedUsers?.edges?.map((edge) => edge?.node)

  const handleContinue = () => {
    router.push('/onboarding/finish')
  }

  return (
    <div className="onboarding-bg page-center">
      <Card className="w-full sm:max-w-xl border-2 shadow-lg">
        <CardBody className="linkify space-y-2">
          <div className="flex items-center mb-5 space-x-5">
            <Link href="/onboarding/profile" passHref>
              <Button
                className="mx-auto rounded-full"
                size="lg"
                variant="secondary"
                icon={<ArrowLeftIcon className="h-4 w-4" />}
                outline
              />
            </Link>
            <ProgressBar percentage={75} />
            <Button
              className="mx-auto"
              icon={<ArrowCircleRightIcon className="h-4 w-4" />}
              onClick={handleContinue}
            >
              {showSkip ? 'Skip' : 'Continue'}
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">Suggested people to follow</div>
            <div className="text-gray-500">
              Follow users to get their updates on your feed
            </div>
          </div>
          <div className="pt-5 max-h-[50vh] overflow-y-auto no-scrollbar">
            <ErrorMessage title="Failed to load topics" error={error} />
            {loading ? (
              <div className="space-y-8">
                <UserProfileLargeShimmer showFollow />
                <UserProfileLargeShimmer showFollow />
              </div>
            ) : (
              <div>
                {users?.length === 0 && (
                  <EmptyState
                    message={
                      <div>Star some topics to get suggested users!</div>
                    }
                    icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
                  />
                )}
                <div
                  className="space-y-5 pr-1"
                  onClick={() => setShowSkip(false)}
                >
                  {users?.map((user) => (
                    <UserProfileLarge
                      key={user?.id}
                      user={user as User}
                      showFollow
                      showToast={false}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Follow

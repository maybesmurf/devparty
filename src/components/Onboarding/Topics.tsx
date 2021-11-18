import { gql, useQuery } from '@apollo/client'
import TopicProfileShimmer from '@components/shared/Shimmer/TopicProfileShimmer'
import TopicProfile from '@components/shared/TopicProfile'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { ProgressBar } from '@components/UI/ProgressBar'
import AppContext from '@components/utils/AppContext'
import { GetOnboardingTopicsQuery, Topic } from '@graphql/types.generated'
import { ArrowCircleRightIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'

export const GET_ONBOARDING_TOPICS_QUERY = gql`
  query GetOnboardingTopics($after: String) {
    featuredTopics(first: 50, after: $after) {
      edges {
        node {
          id
          name
          description
          starrers {
            totalCount
          }
          postsCount
          hasStarred
        }
      }
    }
  }
`

const Topics: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const [showSkip, setShowSkip] = useState<boolean>(true)
  const { data, loading, error } = useQuery<GetOnboardingTopicsQuery>(
    GET_ONBOARDING_TOPICS_QUERY,
    { variables: { after: null } }
  )
  const topics = data?.featuredTopics?.edges?.map((edge) => edge?.node)

  const handleContinue = () => {
    router.push('/onboarding/profile')
  }

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  return (
    <div className="onboarding-bg page-center">
      <Card className="w-full sm:max-w-xl border-2 shadow-lg">
        <CardBody className="linkify space-y-2">
          <div className="flex items-center mb-5 space-x-5">
            <Link href="/onboarding" passHref>
              <Button
                className="mx-auto rounded-full"
                size="lg"
                variant="secondary"
                icon={<ArrowLeftIcon className="h-4 w-4" />}
                outline
              />
            </Link>
            <ProgressBar percentage={25} />
            <Button
              className="mx-auto"
              icon={<ArrowCircleRightIcon className="h-4 w-4" />}
              onClick={handleContinue}
            >
              {showSkip ? 'Skip' : 'Continue'}
            </Button>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              What are you interested in?
            </div>
            <div className="text-gray-500">
              Star tags to customize your feed
            </div>
          </div>
          <div className="pt-5 max-h-[50vh] overflow-y-auto no-scrollbar">
            <ErrorMessage title="Failed to load topics" error={error} />
            {loading ? (
              <div className="space-y-5">
                <TopicProfileShimmer showStar />
                <TopicProfileShimmer showStar />
              </div>
            ) : (
              <div
                className="space-y-5 pr-1"
                onClick={() => setShowSkip(false)}
              >
                {topics?.map((topic) => (
                  <TopicProfile
                    key={topic?.id}
                    topic={topic as Topic}
                    showStar
                    showToast={false}
                  />
                ))}
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

export default Topics

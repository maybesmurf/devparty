import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Slug from '@components/shared/Slug'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { imagekitURL } from '@components/utils/imagekitURL'
import { GetTopicQuery, Topic } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import TopicFeed from './Feed'
import TopicMod from './Mod'
import Star from './Star'

export const GET_TOPIC_QUERY = gql`
  query GetTopic($name: String!) {
    topic(name: $name) {
      id
      name
      image
      description
      postsCount
      hasStarred
      featuredAt
    }
  }
`

const ViewTopic: React.FC = () => {
  const { currentUser, staffMode } = useContext(AppContext)
  const router = useRouter()
  const { data, loading, error } = useQuery<GetTopicQuery>(GET_TOPIC_QUERY, {
    variables: { name: router.query.topic },
    skip: !router.isReady
  })
  const topic = data?.topic

  if (!router.isReady || loading) return <PageLoading />

  if (!topic) return <Custom404 />

  return (
    <GridLayout>
      <GridItemEight>
        <TopicFeed topic={topic?.name as string} />
      </GridItemEight>
      <GridItemFour>
        <Card>
          <CardBody>
            <div className="space-y-3">
              <ErrorMessage title="Failed to load post" error={error} />
              {topic?.image && (
                <img
                  src={imagekitURL(topic?.image, 100, 100)}
                  alt={topic?.name}
                  className="h-20 w-20 rounded-lg"
                />
              )}
              <div>
                <div className="flex items-center space-x-3">
                  <Slug slug={topic?.name} prefix="#" className="text-xl" />
                  <Star topic={topic as Topic} showText={false} />
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {topic?.postsCount} Posts
                </div>
              </div>
              {topic?.description && <div>{topic?.description}</div>}
            </div>
          </CardBody>
        </Card>
        {currentUser?.isStaff && staffMode && (
          <TopicMod topic={topic as Topic} />
        )}
      </GridItemFour>
    </GridLayout>
  )
}

export default ViewTopic

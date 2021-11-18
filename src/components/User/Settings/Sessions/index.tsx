import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { GetSessionsQuery, Session } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import useInView from 'react-cool-inview'

import Sidebar from '../Sidebar'
import SingleSession from './SingleSession'

export const GET_SESSION_QUERY = gql`
  query GetSessions($after: String) {
    sessions(first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          current
          isStaff
          ipAddress
          userAgent
          createdAt
          expiresAt
          user {
            id
            username
            profile {
              id
              name
              avatar
            }
          }
        }
      }
    }
  }
`

const SessionsSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading, error, fetchMore } = useQuery<GetSessionsQuery>(
    GET_SESSION_QUERY,
    { variables: { after: null } }
  )
  const sessions = data?.sessions?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.sessions?.pageInfo

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

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card className="mb-4">
          <CardBody className="space-y-4">
            <ErrorMessage title="Failed to load sessions" error={error} />
            {sessions?.map((session) => (
              <SingleSession key={session?.id} session={session as Session} />
            ))}
            {pageInfo?.hasNextPage && (
              <span ref={observe} className="flex justify-center p-5">
                <Spinner size="md" />
              </span>
            )}
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default SessionsSettings

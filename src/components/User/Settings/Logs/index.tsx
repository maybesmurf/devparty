import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/ui/Card'
import { EmptyState } from '@components/ui/EmptyState'
import { PageLoading } from '@components/ui/PageLoading'
import { Spinner } from '@components/ui/Spinner'
import { ClipboardListIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'

import Sidebar from '../Sidebar'
import { LogsSettingsQuery } from './__generated__/index.generated'
import SingleLog from './SingleLog'

export const LOGS_SETTINGS_QUERY = gql`
  query LogsSettingsQuery($after: String) {
    logs(first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          entityId
          action
          createdAt
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
  }
`

const LogsSettings: React.FC = () => {
  const { data, loading, fetchMore } = useQuery<LogsSettingsQuery>(
    LOGS_SETTINGS_QUERY,
    {
      variables: { after: null }
    }
  )
  const logs = data?.logs?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.logs?.pageInfo

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

  if (loading) {
    return <PageLoading message="Loading sessions" />
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        {logs?.length === 0 ? (
          <EmptyState
            message="No audit logs found!"
            icon={<ClipboardListIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          <Card className="mb-4">
            <CardBody className="space-y-4">
              {logs?.map((log: any) => (
                <SingleLog key={log?.id} log={log} />
              ))}
              {pageInfo?.hasNextPage && (
                <span ref={observe} className="flex justify-center p-5">
                  <Spinner size="md" />
                </span>
              )}
            </CardBody>
          </Card>
        )}
      </GridItemEight>
    </GridLayout>
  )
}

export default LogsSettings

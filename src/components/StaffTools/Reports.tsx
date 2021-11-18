import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { formatUsername } from '@components/utils/formatUsername'
import {
  GetStaffReportsQuery,
  ResolveReportMutation,
  ResolveReportMutationVariables
} from '@graphql/types.generated'
import {
  CheckCircleIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon
} from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import useInView from 'react-cool-inview'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'

import { GET_STAFF_STATS_QUERY } from '.'
import ReportEntity from './ReportEntity'
import Sidebar from './Sidebar'

export const GET_STAFF_REPORTS_QUERY = gql`
  query GetStaffReports($after: String) {
    reports(first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          message
          type
          user {
            id
            username
          }
          post {
            id
          }
        }
      }
    }
  }
`

const StaffToolsReports: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<GetStaffReportsQuery>(
    GET_STAFF_REPORTS_QUERY,
    { variables: { after: null } }
  )
  const reports = data?.reports?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.reports?.pageInfo

  const [resolveReport] = useMutation<
    ResolveReportMutation,
    ResolveReportMutationVariables
  >(
    gql`
      mutation ResolveReport($input: ResolveReportInput!) {
        resolveReport(input: $input)
      }
    `,
    {
      refetchQueries: [{ query: GET_STAFF_STATS_QUERY }]
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

  if (loading) return <PageLoading message="Loading reports" />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody>
            <div className="text-xl font-bold">Reports</div>
            <div className="divide-y">
              <ErrorMessage title="Failed to load reports" error={error} />
              {(reports?.length as number) < 1 && (
                <EmptyState
                  icon={<ShieldCheckIcon className="h-8 w-8 text-brand-500" />}
                  message="No reports to process!"
                  hideCard
                />
              )}
              {reports?.map((report: any) => (
                <div key={report?.id} className="py-5 space-y-3">
                  <div className="justify-between flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-10">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Tooltip content="Reported by">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </Tooltip>
                          <Link href={`/u/${report?.user?.username}`} passHref>
                            <a href={`/u/${report?.user?.username}`}>
                              <Slug
                                slug={formatUsername(report?.user?.username)}
                                prefix="@"
                              />
                            </a>
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Tooltip content="Message">
                            <MailIcon className="h-5 w-5 text-gray-500" />
                          </Tooltip>
                          <div>{report?.message}</div>
                        </div>
                      </div>
                      <ReportEntity report={report} />
                    </div>
                    <Button
                      className="mt-3 sm:mt-0 text-sm"
                      size="sm"
                      icon={<CheckCircleIcon className="h-4 w-4" />}
                      onClick={() => {
                        toast.promise(
                          resolveReport({
                            variables: { input: { id: report?.id } }
                          }),
                          {
                            loading: 'Resolving the report...',
                            success: () => 'Report resoved successfully!',
                            error: () => ERROR_MESSAGE
                          }
                        )
                      }}
                    >
                      Resolve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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

export default StaffToolsReports

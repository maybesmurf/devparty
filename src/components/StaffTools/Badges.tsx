import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { GetStaffBadgesQuery } from '@graphql/types.generated'
import React from 'react'
import useInView from 'react-cool-inview'

import Sidebar from './Sidebar'

export const GET_STAFF_BADGES_QUERY = gql`
  query GetStaffBadges($after: String) {
    badges(first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          name
          image
          description
          users(first: 5) {
            totalCount
            edges {
              node {
                id
                username
                profile {
                  avatar
                }
              }
            }
          }
        }
      }
    }
  }
`

const StaffToolsBadges: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<GetStaffBadgesQuery>(
    GET_STAFF_BADGES_QUERY,
    { variables: { after: null } }
  )
  const badges = data?.badges?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.badges?.pageInfo

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

  if (loading) return <PageLoading message="Loading badges" />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="divide-y">
            <ErrorMessage title="Failed to load badges" error={error} />
            {badges?.map((badge: any) => (
              <div key={badge?.id} className="py-3 space-y-3">
                <div>{badge?.description}</div>
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

export default StaffToolsBadges

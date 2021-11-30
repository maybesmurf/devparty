import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Modal } from '@components/UI/Modal'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import { GetStaffBadgesQuery } from '@graphql/types.generated'
import { GiftIcon, PlusCircleIcon } from '@heroicons/react/outline'
import { imagekitURL } from '@lib/imagekitURL'
import React, { useState } from 'react'
import useInView from 'react-cool-inview'

import Sidebar from '../Sidebar'
import AwardBadge from './AwardBadge'
import CreateBadge from './CreateBadge'

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
  const [showCreateBadgeModal, setShowCreateBadgeModal] =
    useState<boolean>(false)
  const [showAwardBadgeModal, setShowAwardBadgeModal] = useState<boolean>(false)
  const [selectedBadgeID, setSelectedBadgeID] = useState<string>()
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
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold">Badges</div>
              <Button
                icon={<PlusCircleIcon className="h-5 w-5" />}
                onClick={() => setShowCreateBadgeModal(!showCreateBadgeModal)}
              >
                Create
              </Button>
              <Modal
                onClose={() => setShowAwardBadgeModal(!showAwardBadgeModal)}
                title="Award Badge"
                show={showAwardBadgeModal}
              >
                <AwardBadge
                  setShowAwardBadgeModal={setShowAwardBadgeModal}
                  selectedBadgeID={selectedBadgeID as string}
                />
              </Modal>
              <Modal
                onClose={() => setShowCreateBadgeModal(!showCreateBadgeModal)}
                title="Create Badge"
                show={showCreateBadgeModal}
              >
                <CreateBadge
                  setShowCreateBadgeModal={setShowCreateBadgeModal}
                />
              </Modal>
            </div>
            <div className="divide-y">
              <ErrorMessage title="Failed to load badges" error={error} />
              {badges?.map((badge: any) => (
                <div
                  key={badge?.id}
                  className="flex justify-between items-center space-x-5 py-5"
                >
                  <div className="flex space-x-4 items-center">
                    <img
                      src={imagekitURL(badge?.image as string, 100, 100)}
                      className="w-24"
                      alt={badge?.name}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        {badge?.name}
                      </div>
                      {badge?.description && (
                        <div className="mt-2 text-gray-600 dark:text-gray-300">
                          {badge?.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="success"
                      icon={<GiftIcon className="h-5 w-5" />}
                      onClick={() => {
                        setSelectedBadgeID(badge?.id)
                        setShowAwardBadgeModal(!showAwardBadgeModal)
                      }}
                    />
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

export default StaffToolsBadges

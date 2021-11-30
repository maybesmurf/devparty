import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import Details from '@components/User/Details'
import AppContext from '@components/utils/AppContext'
import {
  GetProfileReadmeQuery,
  GetUserQuery,
  User
} from '@graphql/types.generated'
import { DocumentTextIcon, PencilIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/formatUsername'
import { imagekitURL } from '@lib/imagekitURL'
import Markdown from 'markdown-to-jsx'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import Custom404 from 'src/pages/404'

import PageType from '../PageType'
import { GET_USER_QUERY } from '../ViewUser'
import EditReadme from './Edit'

export const GET_PROFILE_README_QUERY = gql`
  query GetProfileReadme($username: String!) {
    user(username: $username) {
      profile {
        readme
      }
    }
  }
`

const Readme: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const [showReadmeModal, setShowReadmeModal] = useState<boolean>(false)
  const { data, loading, error } = useQuery<GetUserQuery>(GET_USER_QUERY, {
    variables: { username: router.query.username },
    skip: !router.isReady
  })
  const { data: readmeData, loading: readmeLoading } =
    useQuery<GetProfileReadmeQuery>(GET_PROFILE_README_QUERY, {
      variables: { username: router.query.username },
      skip: !router.isReady
    })
  const user = data?.user

  if (!router.isReady || loading)
    return <PageLoading message="Loading README" />

  if (!user) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${user?.username} (${user?.profile?.name}) / README · Devparty`}
        description={user?.profile?.bio as string}
        image={user?.profile?.avatar as string}
        path={`/u/${user?.username}`}
      />
      <div
        className="h-64"
        style={{
          backgroundImage: `url(${imagekitURL(
            user?.profile?.cover as string
          )})`,
          backgroundColor: `#${user?.profile?.coverBg}`,
          backgroundSize: '60%'
        }}
      />
      <GridLayout>
        <GridItemFour>
          <ErrorMessage title="Failed to load readme" error={error} />
          <Details user={user as User} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <PageType user={user as User} />
          <Card>
            <CardBody>
              {readmeLoading ? (
                <div className="shimmer h-10 w-full rounded-lg" />
              ) : readmeData?.user?.profile?.readme ? (
                <div>
                  <div className="prose dark:prose-dark">
                    <Markdown options={{ wrapper: 'article' }}>
                      {readmeData?.user?.profile?.readme}
                    </Markdown>
                  </div>
                  {user?.id === currentUser?.id && (
                    <Button
                      className="mt-5"
                      size="sm"
                      icon={<PencilIcon className="h-4 w-4" />}
                      onClick={() => setShowReadmeModal(!showReadmeModal)}
                    >
                      Edit README
                    </Button>
                  )}
                </div>
              ) : (
                <EmptyState
                  message={
                    <div className="text-center">
                      <span className="font-bold mr-1">
                        @{formatUsername(user.username)}
                      </span>
                      <span>has no README!</span>
                      {user?.id === currentUser?.id && (
                        <div className="mt-4">
                          <Button
                            onClick={() => setShowReadmeModal(!showReadmeModal)}
                          >
                            Add README
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                  icon={<DocumentTextIcon className="h-8 w-8 text-brand-500" />}
                  hideCard
                />
              )}
              {user?.id === currentUser?.id && (
                <EditReadme
                  readme={readmeData?.user?.profile?.readme as string}
                  showReadmeModal={showReadmeModal}
                  setShowReadmeModal={setShowReadmeModal}
                />
              )}
            </CardBody>
          </Card>
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Readme

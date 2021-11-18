import { gql, useMutation, useQuery } from '@apollo/client'
import Details from '@components/Community/Details'
import {
  GridItemEight,
  GridItemFour,
  GridItemTwelve,
  GridLayout
} from '@components/GridLayout'
import SearchUsers from '@components/shared/SearchUsers'
import DevpartySEO from '@components/shared/SEO'
import Slug from '@components/shared/Slug'
import { Card } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { formatUsername } from '@components/utils/formatUsername'
import {
  AddCommunityModeratorMutation,
  AddCommunityModeratorMutationVariables,
  Community,
  GetCommunityQuery,
  User
} from '@graphql/types.generated'
import { CalendarIcon, GlobeIcon, UsersIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import toast from 'react-hot-toast'
import Custom404 from 'src/pages/404'
import * as timeago from 'timeago.js'

import Rules from '../Rules'
import { GET_COMMUNITY_QUERY } from '../ViewCommunity'
import ModeratorsList, { GET_MODERATORS_QUERY } from './Moderators'

const About: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetCommunityQuery>(GET_COMMUNITY_QUERY, {
    variables: { slug: router.query.slug },
    skip: !router.isReady
  })
  const [addCommunityModerator] = useMutation<
    AddCommunityModeratorMutation,
    AddCommunityModeratorMutationVariables
  >(
    gql`
      mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
        addCommunityModerator(input: $input) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        { query: GET_MODERATORS_QUERY, variables: { slug: router.query.slug } }
      ],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success('Moderator added successfully!')
      }
    }
  )
  const community = data?.community

  if (!router.isReady || loading) return <PageLoading message="Loading about" />

  if (!community) return <Custom404 />

  const handleAdd = (user: User) => {
    addCommunityModerator({
      variables: { input: { userId: user?.id, communityId: community?.id } }
    })
  }

  return (
    <>
      <DevpartySEO
        title={`${community?.slug} (${community?.name}) members · Devparty`}
        description={community?.description as string}
        image={community?.avatar as string}
        path={`/products/${community?.slug}`}
      />
      <GridLayout className="flex-grow-0 pb-0">
        <GridItemTwelve>
          <Details community={community as Community} />
        </GridItemTwelve>
      </GridLayout>
      <GridLayout className="flex-grow-0 pt-0">
        <GridItemEight>
          <Card>
            <div className="divide-y">
              <div className="space-y-2 p-5">
                <div className="text-lg font-bold">Community Info</div>
                <div>{community?.description}</div>
                <div className="pt-4 space-y-4">
                  <div className="flex items-center space-x-1.5">
                    <UsersIcon className="h-6 w-6" />
                    <div>Only members can Post.</div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <GlobeIcon className="h-6 w-6" />
                    <div>
                      Everyone can view posts within any Community on Devparty.
                    </div>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <CalendarIcon className="h-6 w-6" />
                    <div className="flex items-center space-x-1.5">
                      <div>
                        Created {timeago.format(community?.createdAt)} by
                      </div>
                      <Link href={`/u/${community?.owner?.username}`} passHref>
                        <a href={`/u/${community?.owner?.username}`}>
                          <Slug
                            slug={formatUsername(community?.owner?.username)}
                            prefix="@"
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-5 p-5">
                {currentUser?.id === community?.owner?.id && (
                  <div className="space-y-2">
                    <div className="text-lg font-bold">Add Moderators</div>
                    <SearchUsers
                      placeholder="Search by username"
                      onClick={(user) => handleAdd(user)}
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-lg font-bold">Moderators</div>
                  <ModeratorsList />
                </div>
              </div>
              <div>
                <div className="space-y-2 p-5">
                  <div className="text-lg font-bold">Rules</div>
                  <div className="text-sm text-gray-500 linkify">
                    These are set and enforced by Community admins and are in
                    addition to{' '}
                    <Link href="/terms" passHref>
                      <a href="/terms">Devparty's rules</a>
                    </Link>
                    .
                  </div>
                </div>
                <Rules
                  community={community as Community}
                  showCardAndHeading={false}
                />
              </div>
            </div>
          </Card>
        </GridItemEight>
        <GridItemFour>
          <Rules community={community as Community} />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default About

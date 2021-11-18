import { gql, useQuery } from '@apollo/client'
import {
  GridItemEight,
  GridItemFour,
  GridItemTwelve,
  GridLayout
} from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { Community, GetCommunityQuery } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Details from './Details'
import CommunityFeed from './Feed'
import Rules from './Rules'

export const GET_COMMUNITY_QUERY = gql`
  query GetCommunity($slug: String!) {
    community(slug: $slug) {
      id
      name
      slug
      avatar
      description
      hasJoined
      createdAt
      owner {
        id
        username
        profile {
          id
          avatar
        }
      }
      members {
        totalCount
      }
      moderators {
        totalCount
      }
    }
  }
`

const ViewCommunity: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<GetCommunityQuery>(
    GET_COMMUNITY_QUERY,
    {
      variables: { slug: router.query.slug },
      skip: !router.isReady
    }
  )
  const community = data?.community

  if (!router.isReady || loading)
    return <PageLoading message="Loading community" />

  if (!community) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${community?.slug} (${community?.name}) · Devparty`}
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
          <ErrorMessage title="Failed to load post" error={error} />
          <CommunityFeed community={community as Community} />
        </GridItemEight>
        <GridItemFour>
          <Rules community={community as Community} />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default ViewCommunity

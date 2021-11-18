import { useQuery } from '@apollo/client'
import Details from '@components/Community/Details'
import {
  GridItemEight,
  GridItemFour,
  GridItemTwelve,
  GridLayout
} from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { PageLoading } from '@components/UI/PageLoading'
import { Community, GetCommunityQuery } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Rules from '../Rules'
import { GET_COMMUNITY_QUERY } from '../ViewCommunity'
import MembersList from './List'

const Members: React.FC = () => {
  const router = useRouter()
  const { data, loading } = useQuery<GetCommunityQuery>(GET_COMMUNITY_QUERY, {
    variables: { slug: router.query.slug },
    skip: !router.isReady
  })
  const community = data?.community

  if (!router.isReady || loading) return <PageLoading />

  if (!community) return <Custom404 />

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
          <MembersList />
        </GridItemEight>
        <GridItemFour>
          <Rules community={community as Community} />
        </GridItemFour>
      </GridLayout>
    </>
  )
}

export default Members

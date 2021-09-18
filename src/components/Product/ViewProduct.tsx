import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { PageLoading } from '@components/ui/PageLoading'
import { useRouter } from 'next/router'
import React from 'react'
import { Product } from 'src/__generated__/schema.generated'

import { ProductQuery } from './__generated__/ViewProduct.generated'
import Details from './Details'
import ProductFeed from './Feed'

export const PRODUCT_QUERY = gql`
  query ProductQuery($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      avatar
      description
      website
      twitter
      producthunt
      github
      discord
      hasSubscribed
      user {
        id
        username
        profile {
          id
          name
          avatar
          bio
        }
      }
    }
  }
`

const ViewProduct: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<ProductQuery>(PRODUCT_QUERY, {
    variables: { slug: router.query.slug },
    skip: !router.isReady
  })

  if (loading) return <PageLoading message="Loading product" />

  return (
    <GridLayout>
      <GridItemFour>
        <Details product={data?.product as Product} />
      </GridItemFour>
      <GridItemEight>
        <div className="space-y-5">
          <ErrorMessage title="Failed to load post" error={error} />
          <ProductFeed product={data?.product as Product} />
        </div>
      </GridItemEight>
    </GridLayout>
  )
}

export default ViewProduct

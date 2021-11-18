import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import { GetProductQuery, Product } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React from 'react'
import Custom404 from 'src/pages/404'

import Details from './Details'
import ProductFeed from './Feed'

export const GET_PRODUCT_QUERY = gql`
  query GetProduct($slug: String!) {
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
      owner {
        id
        username
        profile {
          id
          name
          avatar
          bio
        }
        status {
          emoji
          text
        }
      }
    }
  }
`

const ViewProduct: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<GetProductQuery>(
    GET_PRODUCT_QUERY,
    {
      variables: { slug: router.query.slug },
      skip: !router.isReady
    }
  )
  const product = data?.product

  if (!router.isReady || loading) return <PageLoading />

  if (!product) return <Custom404 />

  return (
    <GridLayout>
      <DevpartySEO
        title={`${product?.slug} (${product?.name}) · Devparty`}
        description={product?.description as string}
        image={product?.avatar as string}
        path={`/products/${product?.slug}`}
      />
      <GridItemFour>
        <Details product={product as Product} />
      </GridItemFour>
      <GridItemEight>
        <div className="space-y-5">
          <ErrorMessage title="Failed to load post" error={error} />
          <ProductFeed product={product as Product} />
        </div>
      </GridItemEight>
    </GridLayout>
  )
}

export default ViewProduct

import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import ProductProfileLarge from '@components/shared/ProductProfileLarge'
import PostShimmer from '@components/shared/Shimmer/PostShimmer'
import UserProfileShimmer from '@components/shared/Shimmer/UserProfileShimmer'
import { Button } from '@components/ui/Button'
import { Card, CardBody } from '@components/ui/Card'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import { Spinner } from '@components/ui/Spinner'
import { CubeIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import useInView from 'react-cool-inview'
import { Product } from 'src/__generated__/schema.generated'

import { ProductsQuery } from './__generated__/Products.generated'

const Footer = dynamic(() => import('@components/shared/Footer'))

export const PRODUCTS_QUERY = gql`
  query ProductsQuery($after: String) {
    products(first: 10, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        node {
          id
          name
          slug
          avatar
          description
        }
      }
    }
  }
`

const Products: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<ProductsQuery>(
    PRODUCTS_QUERY,
    { variables: { after: null } }
  )
  const products = data?.products?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.products?.pageInfo

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

  if (loading)
    return (
      <GridLayout>
        <GridItemEight>
          <PostShimmer />
        </GridItemEight>
        <GridItemFour>
          <Card>
            <CardBody>
              <UserProfileShimmer showFollow />
            </CardBody>
          </Card>
        </GridItemFour>
      </GridLayout>
    )

  return (
    <GridLayout>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-6">
            <ErrorMessage title="Failed to load products" error={error} />
            {products?.map((product: any) => (
              <ProductProfileLarge
                key={product?.id}
                product={product as Product}
              />
            ))}
            {pageInfo?.hasNextPage && (
              <span ref={observe} className="flex justify-center p-5">
                <Spinner size="md" />
              </span>
            )}
          </CardBody>
        </Card>
      </GridItemEight>
      <GridItemFour>
        <Card>
          <CardBody className="space-y-3">
            <div>
              Launch a new product to Devparty and get noticed by peoples
            </div>
            <Link href="/products/new">
              <a href="/products/new">
                <Button icon={<CubeIcon className="h-4 w-4" />}>
                  <div>Create new Product</div>
                </Button>
              </a>
            </Link>
          </CardBody>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Products

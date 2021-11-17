import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import ProductProfileLarge from '@components/shared/ProductProfileLarge'
import PostShimmer from '@components/shared/Shimmer/PostShimmer'
import ProductProfileLargeShimmer from '@components/shared/Shimmer/ProductProfileLargeShimmer'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetProductsQuery, Product } from '@graphql/types.generated'
import { CubeIcon } from '@heroicons/react/outline'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React from 'react'
import useInView from 'react-cool-inview'

const Footer = dynamic(() => import('@components/shared/Footer'))

export const GET_PRODUCTS_QUERY = gql`
  query GetProducts($after: String) {
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
          hasSubscribed
        }
      }
    }
  }
`

const Products: React.FC = () => {
  const { data, loading, error, fetchMore } = useQuery<GetProductsQuery>(
    GET_PRODUCTS_QUERY,
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
              <ProductProfileLargeShimmer showSubscribe />
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
            {products?.map((product) => (
              <ProductProfileLarge
                key={product?.id}
                product={product as Product}
                showSubscribe
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
            <div>
              <Link href="/products/new" passHref>
                <a href="/products/new">
                  <Button icon={<CubeIcon className="h-4 w-4" />}>
                    <div>Create new Product</div>
                  </Button>
                </a>
              </Link>
            </div>
          </CardBody>
        </Card>
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Products

import { gql, useQuery } from '@apollo/client'
import ProductProfileLarge from '@components/shared/ProductProfileLarge'
import ProductProfileShimmer from '@components/shared/Shimmer/ProductProfileShimmer'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { GetAllUserProductsQuery, Product } from '@graphql/types.generated'
import { UsersIcon } from '@heroicons/react/outline'
import { formatUsername } from '@lib/utilities'
import { useRouter } from 'next/router'
import React from 'react'
import useInView from 'react-cool-inview'

export const GET_ALL_USER_PRODUCTS_QUERY = gql`
  query GetAllUserProducts($after: String, $username: String!) {
    user(username: $username) {
      ownedProducts(first: 10, after: $after) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            slug
            name
            description
            avatar
            hasSubscribed
          }
        }
      }
    }
  }
`

const ProductsList: React.FC = () => {
  const router = useRouter()
  const { data, loading, error, fetchMore } = useQuery<GetAllUserProductsQuery>(
    GET_ALL_USER_PRODUCTS_QUERY,
    {
      variables: {
        after: null,
        username: router.query.username
      },
      skip: !router.isReady
    }
  )
  const products = data?.user?.ownedProducts?.edges?.map((edge) => edge?.node)
  const pageInfo = data?.user?.ownedProducts?.pageInfo

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
      <div className="space-y-3">
        <Card>
          <CardBody>
            <ProductProfileShimmer />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductProfileShimmer />
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <ProductProfileShimmer />
          </CardBody>
        </Card>
      </div>
    )

  return (
    <div>
      <ErrorMessage title="Failed to load followers" error={error} />
      <div className="space-y-3">
        {products?.length === 0 ? (
          <EmptyState
            message={
              <div>
                <span className="font-bold mr-1">
                  @{formatUsername(router.query.username as string)}
                </span>
                <span>doesn’t have any products yet.</span>
              </div>
            }
            icon={<UsersIcon className="h-8 w-8 text-brand-500" />}
          />
        ) : (
          products?.map((product) => (
            <Card key={product?.id}>
              <CardBody>
                <ProductProfileLarge
                  product={product as Product}
                  showSubscribe
                />
              </CardBody>
            </Card>
          ))
        )}
        {pageInfo?.hasNextPage && (
          <span ref={observe} className="flex justify-center p-5">
            <Spinner size="md" />
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductsList

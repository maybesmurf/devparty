import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { GetProductSettingsQuery, Product } from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import ProductSettingsForm from './Form'

export const GET_PRODUCT_SETTINGS_QUERY = gql`
  query GetProductSettings($slug: String!) {
    product(slug: $slug) {
      id
      slug
      name
      description
      avatar
      owner {
        id
      }
    }
  }
`

const ProductSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetProductSettingsQuery>(
    GET_PRODUCT_SETTINGS_QUERY,
    {
      variables: { slug: router.query.slug },
      skip: !router.isReady
    }
  )
  const product = data?.product

  if (loading) return <PageLoading />

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (product?.owner?.id !== currentUser?.id) return <Custom404 />

  return <ProductSettingsForm product={product as Product} />
}

export default ProductSettings

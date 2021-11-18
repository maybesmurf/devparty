import { gql, useQuery } from '@apollo/client'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import {
  GetProductSocialSettingsQuery,
  Product
} from '@graphql/types.generated'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import Custom404 from 'src/pages/404'

import SocialSettingsForm from './Form'

export const GET_PRODUCT_SOCIAL_SETTINGS_QUERY = gql`
  query GetProductSocialSettings($slug: String!) {
    product(slug: $slug) {
      id
      slug
      website
      producthunt
      discord
      github
      twitter
      owner {
        id
      }
    }
  }
`

const SocialSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetProductSocialSettingsQuery>(
    GET_PRODUCT_SOCIAL_SETTINGS_QUERY,
    {
      variables: { slug: router.query.slug },
      skip: !router.isReady
    }
  )
  const product = data?.product

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  if (loading) return <PageLoading />

  if (product?.owner?.id !== currentUser?.id) return <Custom404 />

  return <SocialSettingsForm product={product as Product} />
}

export default SocialSettings

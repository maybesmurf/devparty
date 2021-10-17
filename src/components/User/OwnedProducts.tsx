import { gql, useQuery } from '@apollo/client'
import { Tooltip } from '@components/ui/Tooltip'
import { imagekitURL } from '@components/utils/imagekitURL'
import Link from 'next/link'
import { User } from 'src/__generated__/schema.generated'

import { UserProductsQuery } from './__generated__/OwnedProducts.generated'

export const USER_PRODUCTS_QUERY = gql`
  query UserProductsQuery($username: String!) {
    user(username: $username) {
      ownedProducts {
        edges {
          node {
            id
            slug
            name
            avatar
          }
        }
      }
    }
  }
`

interface Props {
  user: User
}

const OwnedProducts: React.FC<Props> = ({ user }) => {
  const { data, loading } = useQuery<UserProductsQuery>(USER_PRODUCTS_QUERY, {
    variables: { username: user?.username }
  })
  const products = data?.user?.ownedProducts?.edges?.map((edge) => edge?.node)

  const Product = ({ product }: any) => {
    return (
      <Tooltip content={product?.name}>
        <Link href={`/products/${product?.slug}`}>
          <a href={`/products/${product?.slug}`}>
            <img
              className="h-9 w-9 rounded-lg"
              src={imagekitURL(product?.avatar, 100, 100)}
              alt={`#${product?.slug}`}
            />
          </a>
        </Link>
      </Tooltip>
    )
  }

  if (loading)
    return (
      <div className="space-y-2">
        <div className="font-bold">Products</div>
        <div className="flex flex-wrap gap-1.5 w-3/4">
          <div className="shimmer h-9 w-9 rounded-lg"></div>
          <div className="shimmer h-9 w-9 rounded-lg"></div>
          <div className="shimmer h-9 w-9 rounded-lg"></div>
        </div>
      </div>
    )

  return (
    <div className="space-y-2">
      {products?.length !== 0 && <div className="font-bold">Products</div>}
      <div className="flex flex-wrap gap-1.5 w-3/4">
        {products?.map((product: any) => (
          <Product product={product} key={product?.id} />
        ))}
      </div>
    </div>
  )
}

export default OwnedProducts

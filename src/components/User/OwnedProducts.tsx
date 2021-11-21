import { gql, useQuery } from '@apollo/client'
import { Tooltip } from '@components/UI/Tooltip'
import { imagekitURL } from '@components/utils/imagekitURL'
import { GetUserProductsQuery, Product, User } from '@graphql/types.generated'
import Link from 'next/link'

export const GET_USER_PRODUCTS_QUERY = gql`
  query GetUserProducts($username: String!) {
    user(username: $username) {
      id
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
  const { data, loading } = useQuery<GetUserProductsQuery>(
    GET_USER_PRODUCTS_QUERY,
    { variables: { username: user?.username } }
  )
  const products = data?.user?.ownedProducts?.edges?.map((edge) => edge?.node)

  const Product = ({ product }: { product: Product }) => {
    return (
      <Tooltip content={product?.name}>
        <Link href={`/products/${product?.slug}`} passHref>
          <a href={`/products/${product?.slug}`}>
            <img
              className="h-9 w-9 rounded-lg"
              src={imagekitURL(product?.avatar as string, 100, 100)}
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
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
          <div className="shimmer h-9 w-9 rounded-lg" />
        </div>
      </div>
    )

  return (
    <div className="space-y-2">
      {products?.length !== 0 && <div className="font-bold">Products</div>}
      <div className="flex flex-wrap gap-1.5 w-3/4">
        {products?.map((product) => (
          <Product product={product as Product} key={product?.id} />
        ))}
      </div>
    </div>
  )
}

export default OwnedProducts

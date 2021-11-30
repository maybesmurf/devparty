import { Tooltip } from '@components/UI/Tooltip'
import { Product } from '@graphql/types.generated'
import { CubeIcon } from '@heroicons/react/solid'
import { imagekitURL } from '@lib/imagekitURL'
import Link from 'next/link'
import React from 'react'

interface Props {
  product: Product
}

const SelectedProduct: React.FC<Props> = ({ product }) => {
  return (
    <div className="text-xs sm:text-sm flex items-center space-x-2">
      <Tooltip content="Product">
        <CubeIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
      </Tooltip>
      <Link href={`/products/${product?.slug}`} passHref>
        <a
          href={`/products/${product?.slug}`}
          className="flex items-center space-x-1 cursor-pointer"
        >
          <img
            className="h-4 w-4 rounded"
            src={imagekitURL(product?.avatar as string, 50, 50)}
            alt={`#${product?.slug}'`}
          />
          <div className="font-bold text-gray-600 dark:text-gray-200">
            {product?.name}
          </div>
        </a>
      </Link>
    </div>
  )
}

export default SelectedProduct

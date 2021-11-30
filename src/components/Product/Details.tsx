import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import UserProfileLarge from '@components/shared/UserProfileLarge'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { linkifyOptions } from '@components/utils/linkifyOptions'
import { Product } from '@graphql/types.generated'
import { PencilIcon } from '@heroicons/react/outline'
import { imagekitURL } from '@lib/imagekitURL'
import Linkify from 'linkify-react'
import Link from 'next/link'
import { useContext } from 'react'

import ProductMod from './Mod'
import Social from './Social'
import Subscribe from './Subscribe'

interface Props {
  product: Product
}

const Details: React.FC<Props> = ({ product }) => {
  const { currentUser, staffMode } = useContext(AppContext)

  return (
    <div className="mb-4">
      <div className="px-5 sm:px-0 space-y-5">
        <img
          src={imagekitURL(product?.avatar as string, 200, 200)}
          className="rounded-lg h-28 w-28 sm:h-40 sm:w-40 bg-gray-200 dark:bg-gray-700"
          alt={`#${product?.slug}`}
        />
        <div>
          <div className="text-2xl font-bold flex items-center gap-1.5">
            {product?.name}
          </div>
          <div className="text-xl">{product?.slug}</div>
        </div>
        <div>
          {currentUser?.id !== product?.owner?.id ? (
            <Subscribe product={product} showText />
          ) : (
            <Link href={`/products/${product?.slug}/settings/profile`} passHref>
              <a href={`/products/${product?.slug}/settings/profile`}>
                <Button
                  size="md"
                  variant="success"
                  icon={<PencilIcon className="h-4 w-4" />}
                >
                  Edit Product
                </Button>
              </a>
            </Link>
          )}
        </div>
        {product?.description && (
          <div className="linkify">
            <Linkify options={linkifyOptions}>{product?.description}</Linkify>
          </div>
        )}
        <Social product={product} />
        <div className="space-y-2">
          <div className="font-bold">Owned by</div>
          <Card forceRounded>
            <CardBody>
              <UserProfileLarge user={product?.owner} />
            </CardBody>
          </Card>
        </div>
      </div>
      {currentUser?.isStaff && staffMode && <ProductMod product={product} />}
    </div>
  )
}

export default Details

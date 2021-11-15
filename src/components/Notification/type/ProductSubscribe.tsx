import ProductProfileLarge from '@components/shared/ProductProfileLarge'
import UserProfile from '@components/shared/UserProfile'
import { Card, CardBody } from '@components/UI/Card'
import { Notification, Product } from '@graphql/types.generated'
import { PlusCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React from 'react'
import * as timeago from 'timeago.js'

import MarkAsRead from '../Read'

interface Props {
  notification: Notification
}

const ProductSubscribe: React.FC<Props> = ({ notification }) => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <PlusCircleIcon className="h-6 w-6 text-green-500" />
              <UserProfile user={notification?.dispatcher} />
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm cursor-pointer">
                {timeago.format(notification?.createdAt)}
              </div>
              <MarkAsRead notification={notification} />
            </div>
          </div>
          <div className="linkify">
            subscribed to your{' '}
            <Link href={`/products/${notification?.product?.slug}`} passHref>
              <a href={`/products/${notification?.product?.slug}`}>product</a>
            </Link>
          </div>
        </div>
        <ProductProfileLarge
          product={notification?.product as Product}
          showSubscribe
        />
      </CardBody>
    </Card>
  )
}

export default ProductSubscribe

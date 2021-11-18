import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  DeleteProductMutation,
  DeleteProductMutationVariables,
  GetProductSettingsQuery
} from '@graphql/types.generated'
import { TrashIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'
import Custom404 from 'src/pages/404'

import { GET_PRODUCT_SETTINGS_QUERY } from '../Profile'
import Sidebar from '../Sidebar'

const DeleteSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const [deleting, setDeleting] = useState<boolean>(false)
  const { data, loading } = useQuery<GetProductSettingsQuery>(
    GET_PRODUCT_SETTINGS_QUERY,
    {
      variables: { slug: router.query.slug },
      skip: !router.isReady
    }
  )
  const product = data?.product
  const [deleteProduct] = useMutation<
    DeleteProductMutation,
    DeleteProductMutationVariables
  >(
    gql`
      mutation DeleteProduct($input: DeleteProductInput!) {
        deleteProduct(input: $input)
      }
    `,
    {
      onError() {
        toast.error(ERROR_MESSAGE)
      },
      onCompleted() {
        window.location.href = '/'
      }
    }
  )

  const handleExport = () => {
    var confirm = prompt('Type (delete) to confirm')
    if (confirm === 'delete') {
      setDeleting(true)
      deleteProduct({ variables: { input: { id: product?.id as string } } })
    } else {
      toast.success('You cancelled the operation!')
      setDeleting(false)
    }
  }

  if (loading) {
    return <PageLoading message="Loading settings" />
  }

  if (product?.owner?.id !== currentUser?.id) return <Custom404 />

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar slug={product?.slug as string} />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5 linkify">
            <div className="text-lg font-bold text-red-500">Delete product</div>
            <p>
              Deleting this product is permanent. All the data will be wiped out
              immediately and you won't be able to get it back.
            </p>
            <Button
              variant="danger"
              icon={
                deleting ? (
                  <Spinner size="xs" />
                ) : (
                  <TrashIcon className="h-5 w-5" />
                )
              }
              onClick={handleExport}
            >
              {deleting ? 'Deleting in progress...' : 'Delete product'}
            </Button>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default DeleteSettings

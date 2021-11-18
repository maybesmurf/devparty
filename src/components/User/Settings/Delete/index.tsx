import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  DeleteAccountMutation,
  DeleteAccountMutationVariables
} from '@graphql/types.generated'
import { TrashIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'

import Sidebar from '../Sidebar'

const DeleteSettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)
  const [deleting, setDeleting] = useState<boolean>(false)
  const [deleteAccount] = useMutation<
    DeleteAccountMutation,
    DeleteAccountMutationVariables
  >(
    gql`
      mutation DeleteAccount {
        deleteAccount
      }
    `,
    {
      onError() {
        toast.error(ERROR_MESSAGE)
      },
      onCompleted() {
        if (process.browser) router.push('/login')
      }
    }
  )

  const handleExport = () => {
    var confirm = prompt('Type (delete) to confirm')
    if (confirm === 'delete') {
      setDeleting(true)
      deleteAccount()
    } else {
      toast.success('You cancelled the operation!')
      setDeleting(false)
    }
  }

  if (!currentUser) {
    if (process.browser) router.push('/login')
    return <PageLoading />
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5 linkify">
            <div className="text-lg font-bold text-red-500">
              Delete your account
            </div>
            <p>
              Deleting your account is permanent. All your data will be wiped
              out immediately and you won't be able to get it back.
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
              {deleting ? 'Deleting in progress...' : 'Delete your account'}
            </Button>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default DeleteSettings

import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import { PageLoading } from '@components/UI/PageLoading'
import AppContext from '@components/utils/AppContext'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'

import Sidebar from '../Sidebar'
import ChangePasswordForm from './Form'

const SecuritySettings: React.FC = () => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)

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
          <CardBody>
            <ChangePasswordForm />
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default SecuritySettings

import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Card, CardBody } from '@components/UI/Card'
import React from 'react'

import Sidebar from '../Sidebar'
import ChangePasswordForm from './Form'

const SecuritySettings: React.FC = () => {
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

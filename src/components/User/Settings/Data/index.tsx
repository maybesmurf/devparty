import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { DownloadIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'

import Sidebar from '../Sidebar'

const DataSettings: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const [exporting, setExporting] = useState<boolean>(false)
  const handleExport = () => {
    setExporting(true)
    fetch('/api/export')
      .then((response) => [response.status, response.blob()])
      .then(async (result) => {
        if (result[0] === 200) {
          const blob: any = await result[1]
          var url = window.URL.createObjectURL(blob)
          var a = document.createElement('a')
          a.href = url
          a.download = `export-${currentUser?.id}.json`
          document.body.appendChild(a)
          a.click()
          a.remove()
        } else if (result[0] === 429) {
          toast.error(
            'You downloaded the export recently, Please try again after some days!'
          )
        } else {
          toast.error(ERROR_MESSAGE)
        }
      })
      .finally(() => setExporting(false))
  }

  return (
    <GridLayout>
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5 linkify">
            <div className="text-lg font-bold">Export your account</div>
            <p>
              Most of the personal data that Devparty has about you is
              accessible through the Devparty app (e.g. posts, replies, products
              and user account). If you would like to get a consolidated copy of
              this data, you can download it by clicking the <b>Export Now</b>
              button.
            </p>
            <p>
              As the downloadable file you will receive will contain your
              profile information, you should keep it secure and be careful when
              storing, sending, or uploading it to any other services.
            </p>
            <p>
              If you have any questions about the personal data contained in
              your downloadable file, please{' '}
              <Link href="/contact" passHref>
                <a href="/contact">contact us</a>
              </Link>
              .
            </p>
            <p className="text-yellow-500 text-sm flex items-center space-x-1">
              <ExclamationCircleIcon className="h-4 w-4" />
              <div>
                Please note you can download data only once in every 10 days
              </div>
            </p>
            <Button
              icon={
                exporting ? (
                  <Spinner size="xs" />
                ) : (
                  <DownloadIcon className="h-5 w-5" />
                )
              }
              onClick={handleExport}
            >
              {exporting ? 'Cooking your data...' : 'Export account now'}
            </Button>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default DataSettings

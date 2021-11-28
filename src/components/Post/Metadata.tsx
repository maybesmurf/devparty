import { Card, CardBody } from '@components/UI/Card'
import { formatIPFSHash } from '@components/utils/formatIPFSHash'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import React from 'react'

interface Props {
  ipfsHash: string
}

const Metadata: React.FC<Props> = ({ ipfsHash }) => {
  if (!ipfsHash) return null

  return (
    <Card>
      <CardBody className="text-sm text-gray-500">
        <a
          className="flex items-center justify-between"
          href={`https://ipfs.infura.io/ipfs/${ipfsHash}`}
          target="_blank"
          rel="noreferrer"
        >
          <div className="flex items-center space-x-1">
            <div>IPFS METADATA</div>
            <ExternalLinkIcon className="h-4 w-4" />
          </div>
          {ipfsHash ? <div>{formatIPFSHash(ipfsHash)}</div> : <div>OOPS</div>}
        </a>
      </CardBody>
    </Card>
  )
}

export default Metadata

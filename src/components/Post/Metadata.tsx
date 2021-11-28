import { gql, useQuery } from '@apollo/client'
import { Card, CardBody } from '@components/UI/Card'
import { formatIPFSHash } from '@components/utils/formatIPFSHash'
import { GetPostMetadataQuery, Post } from '@graphql/types.generated'
import { ExternalLinkIcon } from '@heroicons/react/outline'
import React from 'react'

export const GET_POST_METADATA_QUERY = gql`
  query GetPostMetadata($id: ID!) {
    post(id: $id) {
      id
      ipfsHash
    }
  }
`

interface Props {
  post: Post
}

const Metadata: React.FC<Props> = ({ post }) => {
  const { data, loading } = useQuery<GetPostMetadataQuery>(
    GET_POST_METADATA_QUERY,
    {
      variables: { id: post?.id },
      skip: !post?.id
    }
  )

  const ipfsHash = data?.post?.ipfsHash

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
          {loading ? (
            <div className="shimmer rounded-lg h-4 w-16" />
          ) : ipfsHash ? (
            <div>{formatIPFSHash(ipfsHash)}</div>
          ) : (
            <div>OOPS</div>
          )}
        </a>
      </CardBody>
    </Card>
  )
}

export default Metadata

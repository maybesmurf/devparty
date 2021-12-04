import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import {
  DeleteTipTierMutation,
  DeleteTipTierMutationVariables,
  TipTier
} from '@graphql/types.generated'
import { TrashIcon } from '@heroicons/react/outline'
import Markdown from 'markdown-to-jsx'
import React from 'react'
import toast from 'react-hot-toast'

import { GET_TIP_TIERS_QUERY } from '.'

interface Props {
  tier: TipTier
}

const SingleTier: React.FC<Props> = ({ tier }) => {
  const [deleteTipTier] = useMutation<
    DeleteTipTierMutation,
    DeleteTipTierMutationVariables
  >(
    gql`
      mutation DeleteTipTier($input: DeleteTipTierInput!) {
        deleteTipTier(input: $input)
      }
    `,
    {
      refetchQueries: [{ query: GET_TIP_TIERS_QUERY }],
      onError(error) {
        toast.error(error.message)
      },
      onCompleted() {
        toast.success('Tip deleted successfully!')
      }
    }
  )

  return (
    <div className="py-5 space-y-3 flex items-start justify-between space-x-5">
      <div className="space-y-3">
        <div className="text-lg font-bold">${tier?.amount}</div>
        <div className="text-lg font-bold">{tier?.name}</div>
        <div className="prose dark:prose-dark">
          <Markdown options={{ wrapper: 'article' }}>
            {tier?.description}
          </Markdown>
        </div>
      </div>
      <Button
        variant="danger"
        size="sm"
        className="text-sm"
        icon={<TrashIcon className="h-4 w-4" />}
        onClick={() =>
          deleteTipTier({ variables: { input: { id: tier?.id } } })
        }
      >
        Delete
      </Button>
    </div>
  )
}

export default SingleTier

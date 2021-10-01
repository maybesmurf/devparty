import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/ui/Spinner'
import { CollectionIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import useSWR from 'swr'

import {
  AvatarSettingsMutation,
  AvatarSettingsMutationVariables
} from './__generated__/Modal.generated'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

interface Props {
  ethAddress: string
}

const NFTAvatarsModal: React.FC<Props> = ({ ethAddress }) => {
  const router = useRouter()
  const { data, error } = useSWR(
    `https://${
      process.env.NODE_ENV === 'production' ? 'api' : 'testnets-api'
    }.opensea.io/api/v1/assets?format=json&limit=9&offset=0&order_direction=desc&owner=${ethAddress}`,
    fetcher
  )
  const [editNFTAvatar] = useMutation<
    AvatarSettingsMutation,
    AvatarSettingsMutationVariables
  >(
    gql`
      mutation AvatarSettingsMutation($input: EditNFTAvatarInput!) {
        editNFTAvatar(input: $input) {
          id
          username
          profile {
            id
            avatar
          }
        }
      }
    `,
    {
      onCompleted(data) {
        toast.success('Avatar has been updated successfully!')
        router.push(`/@/${data?.editNFTAvatar?.username}`)
      }
    }
  )

  if (error)
    return (
      <div className="p-5 text-red-500 font-bold text-center space-y-2">
        <div>Something went wrong!</div>
      </div>
    )

  if (!data)
    return (
      <div className="p-5 font-bold text-center space-y-2">
        <Spinner size="md" className="mx-auto" />
        <div>Loading collectibles from OpenSea</div>
      </div>
    )

  if (data?.assets?.length === 0)
    return (
      <div className="p-5 font-bold text-center space-y-2">
        <CollectionIcon className="h-8 w-8 mx-auto" />
        <div>No collectibles found in OpenSea</div>
      </div>
    )

  return (
    <div className="p-5 space-y-2">
      <div className="grid gap-3 md:grid-cols-3 grid-cols-2">
        {data?.assets?.map((asset: any) => (
          <div key={asset?.id}>
            <div
              className="cursor-pointer"
              onClick={() =>
                editNFTAvatar({
                  variables: {
                    input: {
                      avatar: asset?.image_url,
                      nftSource: asset?.permalink
                    }
                  }
                })
              }
            >
              <img
                className="object-cover h-36 w-36 rounded-lg border"
                src={asset?.image_url}
                alt={asset?.name}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NFTAvatarsModal
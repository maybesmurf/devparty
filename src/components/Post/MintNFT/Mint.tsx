import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Checkbox } from '@components/UI/Checkbox'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import { getContractAddress } from '@components/utils/getContractAddress'
import getNFTData from '@components/utils/getNFTData'
import { getOpenSeaPath } from '@components/utils/getOpenSeaPath'
import getWeb3Modal from '@components/utils/getWeb3Modal'
import {
  MintNftMutation,
  MintNftMutationVariables,
  Post
} from '@graphql/types.generated'
import { Switch } from '@headlessui/react'
import { ArrowRightIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { create, urlSource } from 'ipfs-http-client'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'
import { boolean, object, string } from 'zod'

import NFT from '../../../../data/abi.json'

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

const newNFTSchema = object({
  title: string().min(0).max(255),
  quantity: string().refine((val: string) => !Number.isNaN(parseInt(val, 10)), {
    message: 'Expected number'
  }),
  accept: boolean()
})

interface Props {
  post: Post
  setShowMint: React.Dispatch<React.SetStateAction<boolean>>
  setShowMintForm: React.Dispatch<React.SetStateAction<boolean>>
}

const Mint: React.FC<Props> = ({ post, setShowMint, setShowMintForm }) => {
  const [nsfw, setNsfw] = useState<boolean>(false)
  const { resolvedTheme } = useTheme()
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const [openseaURL, setOpenseaURL] = useState<string>()
  const [error, setError] = useState<string | undefined>()
  const [mintingStatus, setMintingStatus] = useState<string>('')
  const [mintNFT] = useMutation<MintNftMutation, MintNftMutationVariables>(
    gql`
      mutation MintNFT($input: MintNFTInput!) {
        mint(input: $input) {
          id
          address
          tokenId
        }
      }
    `
  )

  const form = useZodForm({
    schema: newNFTSchema,
    defaultValues: {
      title: `Post by @${post?.user?.username} in Devparty`,
      quantity: '1'
    }
  })

  const mintToken = async () => {
    try {
      // Connect to Wallet
      const web3Modal = getWeb3Modal(resolvedTheme || 'light')
      const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())

      // Get signature from the user
      const signer = await web3.getSigner()
      const { name: network } = await web3.getNetwork()
      const expectedNetwork = IS_PRODUCTION
        ? ['homestead', 'matic']
        : ['rinkeby', 'maticmum']

      if (!expectedNetwork.includes(network)) {
        setIsMinting(false)
        return IS_PRODUCTION
          ? setError(
              'You are in wrong network only Mainet and Polygon matic are allowed!'
            )
          : setError(
              'You are in wrong network only Rinkeby and Polygon mumbai are allowed!'
            )
      }

      setIsMinting(true)
      setMintingStatus('Converting your post as an art')
      const { cid } = await client.add(
        urlSource(
          `https://nft.devparty.io/${post?.body}?avatar=${post?.user?.profile?.avatar}`
        )
      )
      setMintingStatus('Uploading metadata to decentralized servers')
      const { path } = await client.add(
        JSON.stringify({
          name: form.watch('title'),
          ...getNFTData(nsfw, post, `https://ipfs.infura.io/ipfs/${cid}`)
        })
      )
      const url = `https://ipfs.infura.io/ipfs/${path}`

      // Mint the Item
      const contract = new ethers.Contract(
        getContractAddress(network) as string,
        NFT.abi,
        signer
      )
      setMintingStatus('Minting NFT in progress')
      const transaction = await contract.issueToken(
        await signer.getAddress(),
        form.watch('quantity'),
        url
      )
      const tx = await transaction.wait()
      let event = tx.events[0]

      setOpenseaURL(
        `https://${
          IS_PRODUCTION ? 'opensea.io' : 'testnets.opensea.io'
        }/${getOpenSeaPath(network, transaction.to, event.args[3].toString())}`
      )

      // Add transaction to the DB
      mintNFT({
        variables: {
          input: {
            postId: post?.id,
            address: transaction.to,
            tokenId: event.args[3].toString(),
            network
          }
        }
      })

      toast.success('Minting has been successfully completed!')
      setMintingStatus('Minting Completed!')
      setShowMint(false)
    } catch {
      setIsMinting(false)
      setError('Transaction has been cancelled!')
    }
  }

  return (
    <div className="space-y-3">
      {mintingStatus === 'Minting Completed!' ? (
        <div className="font-bold text-center space-y-4">
          <div className="space-y-2">
            <div className="text-3xl">🎉</div>
            <div>Your NFT has been successfully minted!</div>
          </div>
          <div>
            <a href={openseaURL} target="_blank" rel="noreferrer">
              <Button
                className="mx-auto"
                icon={<ArrowRightIcon className="h-5 w-5" />}
                outline
              >
                View on Opensea
              </Button>
            </a>
          </div>
        </div>
      ) : isMinting ? (
        <div className="font-bold text-center space-y-2">
          <Spinner size="md" className="mx-auto" />
          <div>{mintingStatus}</div>
        </div>
      ) : (
        <Form form={form} onSubmit={mintToken}>
          <div className="space-y-7">
            <div>
              <TextArea
                label="Title"
                placeholder="Title of your NFT"
                rows={3}
                {...form.register('title')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Number of Editions</div>
                <div className="text-gray-500">1 by default</div>
              </div>
              <div>
                <Input
                  type="number"
                  className="w-20"
                  placeholder="5"
                  {...form.register('quantity')}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold">Explicit Content</div>
                <div className="text-gray-500">18+</div>
              </div>
              <div>
                <Switch
                  checked={nsfw}
                  onChange={setNsfw}
                  className={clsx(
                    { 'bg-brand-500': nsfw },
                    { 'bg-gray-300': !nsfw },
                    'relative inline-flex flex-shrink-0 h-[24.5px] w-12 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
                  )}
                >
                  <span className="sr-only">Use setting</span>
                  <span
                    aria-hidden="true"
                    className={clsx(
                      { 'translate-x-6': nsfw },
                      { 'translate-x-0': !nsfw },
                      'pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200'
                    )}
                  />
                </Switch>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Checkbox id="acceptRights" {...form.register('accept')} />
              <label htmlFor="acceptRights">
                I have the rights to publish this artwork, and understand it
                will be minted on the decentralized network.
              </label>
            </div>
            {error && (
              <ErrorMessage
                title={ERROR_MESSAGE}
                error={{ name: error, message: error }}
              />
            )}
          </div>
          <div className="flex items-center justify-between pt-5 border-t dark:border-gray-800">
            <a
              className="text-sm text-gray-500"
              href="https://ipfs.io"
              target="_blank"
              rel="noreferrer"
            >
              Stored on <b>IPFS</b>
            </a>
            <div className="space-x-1">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowMintForm(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !form.watch('accept') ||
                  parseInt(form.watch('quantity')) < 1 ||
                  parseInt(form.watch('quantity')) > 1000
                }
              >
                Mint NFT
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  )
}

export default Mint

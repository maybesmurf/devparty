import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { Button } from '@components/UI/Button'
import { Checkbox } from '@components/UI/Checkbox'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import getNFTData from '@components/utils/getNFTData'
import { getOpenSeaPath } from '@components/utils/getOpenSeaPath'
import { getTransactionURL } from '@components/utils/getTransactionURL'
import getWeb3Modal from '@components/utils/getWeb3Modal'
import {
  MintNftMutation,
  MintNftMutationVariables,
  Post
} from '@graphql/types.generated'
import { Switch } from '@headlessui/react'
import { FingerPrintIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import { ethers } from 'ethers'
import { create, urlSource } from 'ipfs-http-client'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, EXPECTED_NETWORK, IS_MAINNET } from 'src/constants'
import { getContractAddress } from 'src/lib/getContractAddress'
import { boolean, object, string } from 'zod'

import NFT from '../../../../../artifacts/contracts/Devparty.sol/Devparty.json'
import MintCompleted from './Completed'
import MintPreview from './Preview'
import MintProcessing from './Processing'

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
  setShowMintForm: React.Dispatch<React.SetStateAction<boolean>>
  setIsMinting: React.Dispatch<React.SetStateAction<boolean>>
}

const Mint: React.FC<Props> = ({ post, setShowMintForm, setIsMinting }) => {
  const [nsfw, setNsfw] = useState<boolean>(false)
  const { resolvedTheme } = useTheme()
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [error, setError] = useState<string | undefined>()
  const [openseaURL, setOpenseaURL] = useState<string>()
  const [txURL, setTxURL] = useState<string>()
  const [mintingStatus, setMintingStatus] = useState<
    'NOTSTARTED' | 'PROCESSING' | 'COMPLETED'
  >('NOTSTARTED')
  const [mintingStatusText, setMintingStatusText] = useState<string>('')
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
      setIsMinting(true)
      // Connect to Wallet
      const web3Modal = getWeb3Modal(resolvedTheme || 'light')
      const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())

      // Get signature from the user
      const signer = await web3.getSigner()
      const { name: network } = await web3.getNetwork()

      if (!EXPECTED_NETWORK.includes(network)) {
        setMintingStatus('NOTSTARTED')
        return IS_MAINNET
          ? setError('You are in wrong network, switch to mainnet!')
          : setError('You are in wrong network, switch to testnet!')
      }

      setMintingStatus('PROCESSING')
      setMintingStatusText('Converting your post as an art')
      const { cid } = await client.add(
        urlSource(
          `https://nft.devparty.io/${post?.body}?avatar=${post?.user?.profile?.avatar}&theme=${theme}`
        )
      )
      setMintingStatusText('Uploading metadata to decentralized servers')
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
      setMintingStatusText('Minting NFT in progress')
      const transaction = await contract.issueToken(
        await signer.getAddress(),
        form.watch('quantity'),
        url
      )
      setTxURL(getTransactionURL(network, transaction.hash))
      const tx = await transaction.wait()
      let event = tx.events[0]

      setOpenseaURL(
        `https://${
          IS_MAINNET ? 'opensea.io' : 'testnets.opensea.io'
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

      setMintingStatus('COMPLETED')
      toast.success('Minting has been successfully completed!')
    } catch (error: any) {
      console.log(error.message)
      setMintingStatus('NOTSTARTED')
      setError(
        error?.data?.message
          ? error.data.message
          : 'Transaction has been cancelled!'
      )
    }
  }

  return (
    <div className="space-y-3 border-t dark:border-gray-700">
      {/* Not started */}
      {mintingStatus === 'NOTSTARTED' && (
        <Form form={form} onSubmit={mintToken}>
          <GridLayout className="!p-5">
            <GridItemEight className="space-y-7 !mb-0">
              <div>
                <Input
                  label="Title"
                  placeholder="Title of your NFT"
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
              <div className="flex items-center space-x-3">
                <Checkbox id="acceptRights" {...form.register('accept')} />
                <label htmlFor="acceptRights">
                  I have the rights to publish this artwork, and understand it
                  will be minted on the decentralized network.
                </label>
              </div>
            </GridItemEight>
            <GridItemFour>
              <MintPreview theme={theme} setTheme={setTheme} post={post} />
            </GridItemFour>
          </GridLayout>
          {error && (
            <ErrorMessage
              className="!mx-5 mb-5"
              title={ERROR_MESSAGE}
              error={{ name: error, message: error }}
            />
          )}
          <div className="flex items-center justify-between p-5 border-t dark:border-gray-800">
            <a
              className="text-sm text-gray-500"
              href="https://ipfs.io"
              target="_blank"
              rel="noreferrer"
            >
              Stored on <b>IPFS</b>
            </a>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="danger"
                outline
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
                icon={<FingerPrintIcon className="h-5 w-5" />}
              >
                Mint NFT
              </Button>
            </div>
          </div>
        </Form>
      )}

      {/* Processing */}
      {mintingStatus === 'PROCESSING' && (
        <MintProcessing
          txURL={txURL as string}
          mintingStatusText={mintingStatusText}
        />
      )}

      {/* Completed */}
      {mintingStatus === 'COMPLETED' && (
        <MintCompleted
          txURL={txURL as string}
          openseaURL={openseaURL as string}
        />
      )}
    </div>
  )
}

export default Mint

import { Button } from '@components/UI/Button'
import { ArrowRightIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { create } from 'ipfs-http-client'
import { boolean, object, string } from 'zod'

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
  txURL: string
  openseaURL: string
}

const MintCompleted: React.FC<Props> = ({ txURL, openseaURL }) => {
  return (
    <div className="p-5 font-bold text-center space-y-4">
      <div className="space-y-2">
        <div className="text-3xl">🎉</div>
        <div>Your NFT has been successfully minted!</div>
      </div>
      <div className="flex">
        <div className="mx-auto">
          <a href={txURL} target="_blank" rel="noreferrer">
            <Button
              className="text-sm mb-2"
              variant="success"
              icon={<SwitchHorizontalIcon className="h-4 w-4" />}
              outline
            >
              View Transaction
            </Button>
          </a>
          <a href={openseaURL} target="_blank" rel="noreferrer">
            <Button
              className="text-sm"
              icon={<ArrowRightIcon className="h-4 w-4" />}
              outline
            >
              View on Opensea
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default MintCompleted

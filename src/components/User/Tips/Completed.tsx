import { Button } from '@components/UI/Button'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'

interface Props {
  txURL: string
}

const TXCompleted: React.FC<Props> = ({ txURL }) => {
  return (
    <div className="font-bold text-center space-y-4">
      <div className="space-y-2">
        <div className="text-3xl">🎉</div>
        <div>You tip has been successfully sent!</div>
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
        </div>
      </div>
    </div>
  )
}

export default TXCompleted

import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'

interface Props {
  txURL: string
  progressStatusText: string
}

const TXProcessing: React.FC<Props> = ({ txURL, progressStatusText }) => {
  return (
    <div className="font-bold text-center space-y-2">
      <Spinner size="md" className="mx-auto" />
      <div>{progressStatusText}</div>
      {txURL && (
        <a href={txURL} target="_blank" rel="noreferrer">
          <Button
            className="text-sm mt-3 mx-auto"
            variant="success"
            icon={<SwitchHorizontalIcon className="h-4 w-4" />}
            outline
          >
            View Transaction
          </Button>
        </a>
      )}
    </div>
  )
}

export default TXProcessing

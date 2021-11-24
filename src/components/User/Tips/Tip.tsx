import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Modal } from '@components/UI/Modal'
import { getContractAddress } from '@components/utils/getContractAddress'
import { getTransactionURL } from '@components/utils/getTransactionURL'
import getWeb3Modal from '@components/utils/getWeb3Modal'
import { TipTier } from '@graphql/types.generated'
import { HeartIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, IS_PRODUCTION } from 'src/constants'

import Sponsor from '../../../../data/abi.json'
import TXCompleted from './Completed'
import TXProcessing from './Processing'

interface Props {
  tier: TipTier
  address: string
}

const Tip: React.FC<Props> = ({ tier, address }) => {
  const [showTxModal, setShowTxModal] = useState<boolean>(false)
  const [progressStatus, setProgressStatus] = useState<
    'NOTSTARTED' | 'PROCESSING' | 'COMPLETED'
  >('NOTSTARTED')
  const [progressStatusText, setProgressStatusText] = useState<string>('')
  const [txURL, setTxURL] = useState<string>()
  const [error, setError] = useState<string | undefined>()
  const { resolvedTheme } = useTheme()

  const sponsorUser = async () => {
    try {
      setProgressStatus('PROCESSING')
      setTxURL('')
      // Connect to Wallet
      const web3Modal = getWeb3Modal(resolvedTheme || 'light')
      const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())

      // Get tx confirmation from the user
      setShowTxModal(true)
      setProgressStatusText('Please confirm the transaction in wallet')
      const signer = await web3.getSigner()
      const { name: network } = await web3.getNetwork()
      const expectedNetwork = IS_PRODUCTION
        ? ['homestead', 'matic']
        : ['rinkeby', 'maticmum']

      if (!expectedNetwork.includes(network)) {
        setProgressStatus('NOTSTARTED')
        return IS_PRODUCTION
          ? setError(
              'You are in wrong network only Mainet and Polygon matic are allowed!'
            )
          : setError(
              'You are in wrong network only Rinkeby and Polygon mumbai are allowed!'
            )
      }

      // Sponsor the user
      const contract = new ethers.Contract(
        getContractAddress(network) as string,
        Sponsor.abi,
        signer
      )
      const transaction = await contract.tipUser(address, {
        // @ts-ignore
        value: ethers.utils.parseEther(tier?.amount?.toString()).toString(10)
      })
      setProgressStatusText('Transaction is being processed')
      setTxURL(getTransactionURL(network, transaction.hash))
      const tx = await transaction.wait()
      let event = tx.events[0]
      setProgressStatus('COMPLETED')
      toast.success('Sponsor Transaction completed!')
    } catch (error: any) {
      setProgressStatus('NOTSTARTED')
      setTxURL('')
      setError(
        error?.data?.message
          ? error.data.message
          : 'Transaction has been cancelled!'
      )
    }
  }

  return (
    <div>
      <Button
        variant="danger"
        icon={<HeartIcon className="h-5 2-5" />}
        outline
        disabled={progressStatus === 'PROCESSING'}
        onClick={() => sponsorUser()}
      >
        {progressStatus === 'PROCESSING' ? 'Processing' : 'Tip'}
      </Button>
      <Modal
        onClose={() => setShowTxModal(!showTxModal)}
        title="Sponsor Progress"
        show={showTxModal}
      >
        <div className="p-5">
          {progressStatus === 'NOTSTARTED' && error && (
            <ErrorMessage
              title={ERROR_MESSAGE}
              error={{ name: error, message: error }}
            />
          )}
          {progressStatus === 'PROCESSING' && (
            <TXProcessing
              txURL={txURL as string}
              progressStatusText={progressStatusText}
            />
          )}
          {progressStatus === 'COMPLETED' && (
            <TXCompleted txURL={txURL as string} />
          )}
        </div>
      </Modal>
    </div>
  )
}

export default Tip

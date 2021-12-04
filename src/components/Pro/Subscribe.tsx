import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Modal } from '@components/UI/Modal'
import { getTransactionURL } from '@lib/getTransactionURL'
import getWeb3Modal from '@lib/getWeb3Modal'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, IS_MAINNET } from 'src/constants'
import { getContractAddress } from 'src/lib/getContractAddress'

import SubscribeTier from '../../../artifacts/contracts/Devparty.sol/Devparty.json'
import TXCompleted from './Completed'
import TXProcessing from './Processing'

interface Props {
  amount: string
}

const Subscribe: React.FC<Props> = ({ amount }) => {
  const [showTxModal, setShowTxModal] = useState<boolean>(false)
  const [progressStatus, setProgressStatus] = useState<
    'NOTSTARTED' | 'PROCESSING' | 'COMPLETED'
  >('NOTSTARTED')
  const [progressStatusText, setProgressStatusText] = useState<string>('')
  const [txURL, setTxURL] = useState<string>()
  const [error, setError] = useState<string | undefined>()
  const { resolvedTheme } = useTheme()

  const subscribe = async () => {
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
      const EXPECTED_NETWORK = IS_MAINNET ? ['matic'] : ['maticmum']

      if (!EXPECTED_NETWORK.includes(network)) {
        setProgressStatus('NOTSTARTED')
        return IS_MAINNET
          ? setError('You are in wrong network, switch to mainnet!')
          : setError('You are in wrong network, switch to testnet!')
      }

      // Subscribe to Devparty
      const contract = new ethers.Contract(
        getContractAddress(network) as string,
        SubscribeTier.abi,
        signer
      )
      const transaction = await contract.subscribeToPro({
        value: ethers.utils
          .parseEther(amount)
          // @ts-ignore
          .toString(10)
      })
      setProgressStatusText('Transaction is being processed')
      setTxURL(getTransactionURL(network, transaction.hash))
      await transaction.wait()
      setProgressStatus('COMPLETED')
      toast.success('Subscribe Transaction completed!')
    } catch (error: any) {
      console.log(error)
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
        className="w-full"
        size="lg"
        disabled={progressStatus === 'PROCESSING'}
        onClick={() => subscribe()}
      >
        {progressStatus === 'PROCESSING' ? 'Processing' : 'Try now'}
      </Button>
      <Modal
        onClose={() => setShowTxModal(!showTxModal)}
        title="Subscription Progress"
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

export default Subscribe

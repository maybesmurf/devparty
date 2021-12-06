import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import {
  TipTier,
  TipUserMutation,
  TipUserMutationVariables
} from '@graphql/types.generated'
import { HeartIcon } from '@heroicons/react/outline'
import { getTransactionURL } from '@lib/getTransactionURL'
import getWeb3Modal from '@lib/getWeb3Modal'
import { providers, utils } from 'ethers'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ERROR_MESSAGE,
  EXPECTED_NETWORK,
  IS_MAINNET,
  SIGNING_MESSAGE
} from 'src/constants'

import TXCompleted from './Completed'
import TXProcessing from './Processing'

interface Props {
  tier: TipTier
  tipaddress: string
  eth: number
}

const Tip: React.FC<Props> = ({ tier, tipaddress, eth }) => {
  const { currentUser } = useContext(AppContext)
  const [showTxModal, setShowTxModal] = useState<boolean>(false)
  const [progressStatus, setProgressStatus] = useState<
    'NOTSTARTED' | 'PROCESSING' | 'COMPLETED'
  >('NOTSTARTED')
  const [progressStatusText, setProgressStatusText] = useState<string>('')
  const [txURL, setTxURL] = useState<string>()
  const [error, setError] = useState<string | undefined>()
  const { resolvedTheme } = useTheme()
  const [tipUser] = useMutation<TipUserMutation, TipUserMutationVariables>(
    gql`
      mutation TipUser($input: TipUserInput!) {
        tipUser(input: $input) {
          id
        }
      }
    `
  )

  const handleTipUser = async () => {
    try {
      setProgressStatus('PROCESSING')
      setTxURL('')
      // Connect to Wallet
      const web3Modal = getWeb3Modal(resolvedTheme || 'light')
      const web3 = new providers.Web3Provider(await web3Modal.connect())

      // Get tx confirmation from the user
      setShowTxModal(true)
      setProgressStatusText('Generating unique signature')
      const signer = await web3.getSigner()
      const { name: network } = await web3.getNetwork()

      if (!EXPECTED_NETWORK.includes(network)) {
        setProgressStatus('NOTSTARTED')
        return IS_MAINNET
          ? setError('You are in wrong network, switch to mainnet!')
          : setError('You are in wrong network, switch to testnet!')
      }

      // Get signature from the user
      const address = await web3.getSigner().getAddress()
      const response = await fetch(`/api/auth/getNonce?address=${address}`)
      const data = await response.json()
      setProgressStatusText('Please sign to confirm ownership')
      const signature = await web3
        .getSigner()
        .provider.send('personal_sign', [
          `${SIGNING_MESSAGE} ${data?.nonce}`,
          address
        ])

      // Self address check
      if (address === tipaddress) {
        setShowTxModal(false)
        setProgressStatus('NOTSTARTED')
        return toast.error("You can't tip to the same address!")
      }

      // Tip the user
      setProgressStatusText('Please confirm the transaction in wallet')
      const transaction = await signer.sendTransaction({
        to: tipaddress,
        value: utils.parseEther(
          ['matic', 'maticmum'].includes(network)
            ? tier?.amount?.toString()
            : eth.toFixed(5)
        )
      })
      setProgressStatusText('Transaction is being processed')
      setTxURL(getTransactionURL(network, transaction.hash))
      tipUser({
        variables: {
          input: {
            signature: signature as string,
            nonce: data?.nonce,
            txHash: transaction.hash,
            tierId: tier?.id,
            receiverAddress: address,
            dispatcherAddress: transaction.from,
            userId: currentUser?.id as string
          }
        }
      })
      await transaction.wait()
      setProgressStatus('COMPLETED')
      toast.success('Tip Transaction completed!')
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
      {currentUser ? (
        <>
          <Button
            variant="danger"
            icon={<HeartIcon className="h-5 2-5" />}
            outline
            disabled={progressStatus === 'PROCESSING' || !eth}
            onClick={() => handleTipUser()}
          >
            {progressStatus === 'PROCESSING' ? 'Processing' : 'Tip'}
          </Button>
          <Modal
            onClose={() => setShowTxModal(!showTxModal)}
            title="Tipping Progress"
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
        </>
      ) : (
        <Link href="/login">
          <a href="/login">
            <Button
              variant="danger"
              icon={<HeartIcon className="h-5 2-5" />}
              outline
            >
              Tip
            </Button>
          </a>
        </Link>
      )}
    </div>
  )
}

export default Tip

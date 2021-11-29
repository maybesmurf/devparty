import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Modal } from '@components/UI/Modal'
import AppContext from '@components/utils/AppContext'
import { getContractAddress } from '@components/utils/getContractAddress'
import { getTransactionURL } from '@components/utils/getTransactionURL'
import getWeb3Modal from '@components/utils/getWeb3Modal'
import {
  TipTier,
  TipUserMutation,
  TipUserMutationVariables
} from '@graphql/types.generated'
import { HeartIcon } from '@heroicons/react/outline'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE, EXPECTED_NETWORK, IS_MAINNET } from 'src/constants'

import Sponsor from '../../../../artifacts/contracts/Devparty.sol/Devparty.json'
import TXCompleted from './Completed'
import TXProcessing from './Processing'

interface Props {
  tier: TipTier
  address: string
  eth: number
}

const Tip: React.FC<Props> = ({ tier, address, eth }) => {
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

      if (!EXPECTED_NETWORK.includes(network)) {
        setProgressStatus('NOTSTARTED')
        return IS_MAINNET
          ? setError('You are in wrong network, switch to mainnet!')
          : setError('You are in wrong network, switch to testnet!')
      }

      console.log(getContractAddress(network))

      // Sponsor the user
      const contract = new ethers.Contract(
        getContractAddress(network) as string,
        Sponsor.abi,
        signer
      )
      const transaction = await contract.tipUser(address, {
        value: ethers.utils
          .parseEther(
            ['matic', 'maticmum'].includes(network)
              ? tier?.amount?.toString()
              : eth.toString()
          )
          // @ts-ignore
          .toString(10)
      })
      setProgressStatusText('Transaction is being processed')
      setTxURL(getTransactionURL(network, transaction.hash))
      tipUser({
        variables: {
          input: {
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
      toast.success('Sponsor Transaction completed!')
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
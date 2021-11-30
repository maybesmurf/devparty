import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import {
  Integration,
  WalletSettingsMutation,
  WalletSettingsMutationVariables
} from '@graphql/types.generated'
import getWeb3Modal from '@lib/getWeb3Modal'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { GET_INTEGRATION_QUERY } from '.'

interface Props {
  integration: Integration
}

const ConnectWallet: React.FC<Props> = ({ integration }) => {
  const { resolvedTheme } = useTheme()
  const [buttonText, setButtonText] = useState<string>(
    integration?.ethAddress
      ? 'Disconnect Ethereum Wallet'
      : 'Connect Ethereum Wallet'
  )
  const [error, setError] = useState<boolean>(false)
  const [editWallet] = useMutation<
    WalletSettingsMutation,
    WalletSettingsMutationVariables
  >(
    gql`
      mutation WalletSettings($input: EditIntegrationInput!) {
        editIntegration(input: $input) {
          id
          ethAddress
        }
      }
    `,
    {
      refetchQueries: [{ query: GET_INTEGRATION_QUERY }],
      onError() {
        setError(true)
      },
      onCompleted() {
        toast.success('Wallet has been connected successfully!')
      }
    }
  )

  const connectWallet = async () => {
    setButtonText('Connecting Wallet...')
    const web3Modal = getWeb3Modal(resolvedTheme || 'light')
    const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())
    const address = await web3.getSigner().getAddress()
    await editWallet({ variables: { input: { ethAddress: address } } })
    web3Modal.clearCachedProvider()
    setButtonText('Disconnect Ethereum Wallet')
    setError(false)
  }

  const disconnectWallet = async () => {
    setButtonText('Disconnecting Wallet...')
    await editWallet({
      variables: {
        input: { ethAddress: null }
      }
    })
    setButtonText('Connect Ethereum Wallet')
  }

  return (
    <>
      {error && (
        <div>
          <ErrorMessage
            title="Your wallet address is already associated with other account!"
            error={{
              name: 'error',
              message:
                'This wallet is already associated with another account in Devparty profile. Please switch to a different account in your wallet and try again.'
            }}
          />
        </div>
      )}
      {integration?.ethAddress ? (
        <Button
          className="w-full"
          variant={
            buttonText === 'Disconnecting Wallet...' ? 'warning' : 'danger'
          }
          type="button"
          onClick={disconnectWallet}
        >
          {buttonText}
        </Button>
      ) : (
        <Button
          className="w-full"
          variant={
            buttonText === 'Connecting Wallet...' ? 'warning' : 'success'
          }
          type="button"
          onClick={connectWallet}
        >
          {buttonText}
        </Button>
      )}
    </>
  )
}

export default ConnectWallet

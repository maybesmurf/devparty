import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/ui/Button'
import { ErrorMessage } from '@components/ui/ErrorMessage'
import getWeb3Modal from '@components/utils/getWeb3Modal'
import { ethers } from 'ethers'
import mixpanel from 'mixpanel-browser'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Integration } from 'src/__generated__/schema.generated'

import {
  WalletSettingsMutation,
  WalletSettingsMutationVariables
} from './__generated__/ConnectWallet.generated'

interface Props {
  integration: Integration
}

const ConnectWallet: React.FC<Props> = ({ integration }) => {
  const { resolvedTheme } = useTheme()
  const [error, setError] = useState<boolean>(false)
  const [editWallet] = useMutation<
    WalletSettingsMutation,
    WalletSettingsMutationVariables
  >(
    gql`
      mutation WalletSettingsMutation($input: EditIntegrationInput!) {
        editIntegration(input: $input) {
          id
          user {
            ethAddress
          }
        }
      }
    `,
    {
      onError() {
        setError(true)
      },
      onCompleted() {
        toast.success('Wallet has been connected successfully!')
      }
    }
  )

  const connectWallet = async () => {
    mixpanel.track('user.integration.wallet.connect')
    if (typeof window.web3 !== 'object') {
      return toast.error('Metamask not found in the browser!')
    }

    const web3Modal = getWeb3Modal({ theme: resolvedTheme })
    const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())
    const address = await web3.getSigner().getAddress()

    editWallet({
      variables: {
        input: {
          ethAddress: address
        }
      }
    })

    web3Modal.clearCachedProvider()
    setError(false)
  }

  const disconnectWallet = async () => {
    mixpanel.track('user.integration.wallet.disconnect')
    editWallet({
      variables: {
        input: { ethAddress: null }
      }
    })
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
      {integration.user?.ethAddress ? (
        <Button
          className="w-full"
          variant="danger"
          type="button"
          onClick={disconnectWallet}
        >
          Disconnect MetaMask
        </Button>
      ) : (
        <Button
          className="w-full"
          variant="success"
          type="button"
          onClick={connectWallet}
        >
          Connect MetaMask
        </Button>
      )}
    </>
  )
}

export default ConnectWallet
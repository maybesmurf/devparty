import { gql, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { useAuthRedirect } from '@components/utils/hooks/useAuthRedirect'
import {
  AuthWithWalletMutation,
  AuthWithWalletMutationVariables
} from '@graphql/types.generated'
import getWeb3Modal from '@lib/getWeb3Modal'
import { ethers } from 'ethers'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { SIGNING_MESSAGE, STATIC_ASSETS } from 'src/constants'

const AuthWithWallet: React.FC = () => {
  const authRedirect = useAuthRedirect()
  const { resolvedTheme } = useTheme()
  const [loginButtonMessage, setLoginButtonMessage] = useState<string>('Wallet')
  const [authWithWallet] = useMutation<
    AuthWithWalletMutation,
    AuthWithWalletMutationVariables
  >(
    gql`
      mutation AuthWithWallet($input: AuthWithWalletInput!) {
        authWithWallet(input: $input) {
          id
        }
      }
    `,
    {
      onCompleted() {
        authRedirect()
      }
    }
  )

  const connectWallet = async () => {
    try {
      setLoginButtonMessage('Connecting...')
      const web3Modal = getWeb3Modal(resolvedTheme || 'light')
      const web3 = new ethers.providers.Web3Provider(await web3Modal.connect())
      const address = await web3.getSigner().getAddress()
      const response = await fetch(`/api/auth/getNonce?address=${address}`)
      const data = await response.json()
      if (data.status === 'error') {
        toast.error(data.message)
        setLoginButtonMessage('Wallet')
      } else {
        setLoginButtonMessage('Please sign...')
        const signature = await web3
          .getSigner()
          .provider.send('personal_sign', [
            `Welcome to Devparty 👋\n\n${SIGNING_MESSAGE} ${data?.nonce}`,
            address
          ])

        setLoginButtonMessage('Logging in...')
        await authWithWallet({
          variables: { input: { nonce: data?.nonce as string, signature } }
        })
        web3Modal.clearCachedProvider()
      }
    } finally {
      setLoginButtonMessage('Wallet')
    }
  }

  return (
    <Button
      size="lg"
      type="button"
      variant="success"
      className="w-full justify-center text-[#F6851B] border-[#F6851B] hover:bg-[#ffe9d5] focus:ring-[#F6851B]"
      onClick={connectWallet}
      disabled={loginButtonMessage !== 'Wallet'}
      icon={
        <img
          src={`${STATIC_ASSETS}/brands/metamask.svg`}
          className="h-4 w-4"
          alt="MetaMask Logo"
        />
      }
      outline
    >
      {loginButtonMessage}
    </Button>
  )
}

export default AuthWithWallet

import { gql, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import { GetUserTipsQuery, User } from '@graphql/types.generated'
import { PencilIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import { useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { STATIC_ASSETS } from 'src/constants'

const GET_USER_TIPS_QUERY = gql`
  query GetUserTips($username: String!) {
    user(username: $username) {
      id
      tip {
        id
        cash
        paypal
        github
        buymeacoffee
        bitcoin
        ethereum
        user {
          id
        }
      }
    }
  }
`

interface SingleTipProps {
  icon: string
  link?: string
  text: string
}

const SingleTip: React.FC<SingleTipProps> = ({ icon, link, text }) => (
  <a
    className="flex flex-col justify-center items-center text-center dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 bg-gray-100 border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 rounded-md p-4 shadow-sm"
    href={link}
    target="_blank"
    rel="noreferrer"
  >
    <img
      className="h-6 w-6"
      src={`${STATIC_ASSETS}/tips/${icon}.svg`}
      alt={text}
    />
    <span className="mt-2">{text}</span>
  </a>
)

const SingleTipShimmer: React.FC = () => (
  <div className="flex flex-col justify-center items-center text-center shimmer rounded-md p-4 shadow-sm h-20" />
)

interface Props {
  user: User
}

const TipsDetails: React.FC<Props> = ({ user }) => {
  const { currentUser } = useContext(AppContext)
  const { data, loading } = useQuery<GetUserTipsQuery>(GET_USER_TIPS_QUERY, {
    variables: { username: user?.username },
    skip: !user?.username
  })
  const tip = data?.user?.tip

  if (loading)
    return (
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
          <SingleTipShimmer />
          <SingleTipShimmer />
          <SingleTipShimmer />
          <SingleTipShimmer />
        </div>
      </div>
    )

  return (
    <>
      <div className="p-5">
        <div className="grid gap-4 md:grid-cols-4 grid-cols-2">
          {tip?.cash && (
            <SingleTip
              icon="cash"
              link={`https://cash.app/$${tip?.cash}`}
              text="Cash"
            />
          )}
          {tip?.paypal && (
            <SingleTip
              icon="paypal"
              link={`https://paypal.me/${tip?.paypal}`}
              text="PayPal"
            />
          )}
          {tip?.github && (
            <SingleTip
              icon="github"
              link={`https://github.com/sponsors/${tip?.github}`}
              text="GitHub"
            />
          )}
          {tip?.buymeacoffee && (
            <SingleTip
              icon="buymeacoffee"
              link={`https://www.buymeacoffee.com/${tip?.buymeacoffee}`}
              text="BMC"
            />
          )}
          {tip?.bitcoin && (
            <CopyToClipboard
              text={tip?.bitcoin}
              onCopy={() => {
                toast.success('Bitcoin address copied!')
              }}
            >
              <div className="cursor-pointer">
                <SingleTip icon="bitcoin" text="Bitcoin" />
              </div>
            </CopyToClipboard>
          )}
          {tip?.ethereum && (
            <CopyToClipboard
              text={tip?.ethereum}
              onCopy={() => {
                toast.success('Ethereum address copied!')
              }}
            >
              <div className="cursor-pointer">
                <SingleTip icon="ethereum" text="Ethereum" />
              </div>
            </CopyToClipboard>
          )}
        </div>
      </div>
      {tip?.user?.id === currentUser?.id && (
        <div className="border-t dark:border-gray-800 py-4 px-4 flex items-center justify-between">
          <div className="text-sm">Send your tip 💫</div>
          <Link href="/settings/tips" passHref>
            <a href="/settings/tips">
              <Button
                className="text-sm"
                icon={<PencilIcon className="h-4 w-4" />}
              >
                Edit Tips
              </Button>
            </a>
          </Link>
        </div>
      )}
    </>
  )
}

export default TipsDetails

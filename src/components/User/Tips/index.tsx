import { gql, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import DevpartySEO from '@components/shared/SEO'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { PageLoading } from '@components/UI/PageLoading'
import Details from '@components/User/Details'
import { formatUsername } from '@components/utils/formatUsername'
import {
  GetUserQuery,
  GetUserTipsQuery,
  TipTier,
  User
} from '@graphql/types.generated'
import { CashIcon } from '@heroicons/react/outline'
import { imagekitURL } from '@lib/imagekitURL'
import { useRouter } from 'next/router'
import React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { STATIC_ASSETS } from 'src/constants'
import Custom404 from 'src/pages/404'

import PageType from '../PageType'
import { GET_USER_QUERY } from '../ViewUser'
import TipTiers from './Tiers'

export const GET_USER_TIPS_QUERY = gql`
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
        tiers {
          totalCount
          edges {
            node {
              id
              name
              description
              amount
            }
          }
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

const Tips: React.FC = () => {
  const router = useRouter()
  const { data, loading, error } = useQuery<GetUserQuery>(GET_USER_QUERY, {
    variables: { username: router.query.username },
    skip: !router.isReady
  })
  const { data: tipsData, loading: tipsLoading } = useQuery<GetUserTipsQuery>(
    GET_USER_TIPS_QUERY,
    {
      variables: { username: router.query.username },
      skip: !router.isReady
    }
  )
  const user = data?.user
  const tip = tipsData?.user?.tip
  const tiers = tip?.tiers?.edges?.map((edge) => edge?.node)

  if (!router.isReady || loading) return <PageLoading message="Loading tips" />

  if (!user) return <Custom404 />

  return (
    <>
      <DevpartySEO
        title={`${user?.username} (${user?.profile?.name}) / Tips · Devparty`}
        description={user?.profile?.bio as string}
        image={user?.profile?.avatar as string}
        path={`/u/${user?.username}`}
      />
      <div
        className="h-64"
        style={{
          backgroundImage: `url(${imagekitURL(
            user?.profile?.cover as string
          )})`,
          backgroundColor: `#${user?.profile?.coverBg}`,
          backgroundSize: '60%'
        }}
      />
      <GridLayout>
        <GridItemFour>
          <ErrorMessage title="Failed to load tips" error={error} />
          <Details user={user as User} />
        </GridItemFour>
        <GridItemEight className="space-y-5">
          <PageType user={user as User} />
          <Card>
            <CardBody>
              {tipsLoading ? (
                <div className="shimmer h-10 w-full rounded-lg" />
              ) : tip?.bitcoin ||
                tip?.buymeacoffee ||
                tip?.cash ||
                tip?.ethereum ||
                tip?.github ||
                tip?.paypal ? (
                <div>
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
                  {tip?.ethereum && tip?.tiers?.totalCount > 0 && (
                    <TipTiers
                      tiers={tiers as TipTier[]}
                      address={tip?.ethereum}
                    />
                  )}
                </div>
              ) : (
                <EmptyState
                  message={
                    <div className="text-center">
                      <span className="font-bold mr-1">
                        @{formatUsername(user.username)}
                      </span>
                      <span>has no tips configured!</span>
                    </div>
                  }
                  icon={<CashIcon className="h-8 w-8 text-brand-500" />}
                  hideCard
                />
              )}
            </CardBody>
          </Card>
        </GridItemEight>
      </GridLayout>
    </>
  )
}

export default Tips

import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import Slug from '@components/shared/Slug'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import AppContext from '@components/utils/AppContext'
import { formatUsername } from '@components/utils/formatUsername'
import { humanize } from '@components/utils/humanize'
import { imagekitURL } from '@components/utils/imagekitURL'
import { linkifyOptions } from '@components/utils/linkifyOptions'
import { Community } from '@graphql/types.generated'
import {
  CalendarIcon,
  PencilIcon,
  ShieldCheckIcon,
  UsersIcon
} from '@heroicons/react/outline'
import Linkify from 'linkify-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import * as timeago from 'timeago.js'

import Join from './Join'

interface Props {
  community: Community
}

const Details: React.FC<Props> = ({ community }) => {
  const router = useRouter()
  const { currentUser } = useContext(AppContext)

  return (
    <Card className="mb-4">
      <CardBody>
        <GridLayout className="!p-0">
          <GridItemEight>
            <div className="flex items-center space-x-5">
              <img
                src={imagekitURL(community?.avatar as string, 200, 200)}
                className="rounded-lg h-28 w-28 sm:h-40 sm:w-40 bg-gray-200 dark:bg-gray-700"
                alt={`#${community?.slug}`}
              />
              <div>
                <div>
                  <div className="text-2xl font-bold flex items-center gap-1.5">
                    {community?.name}
                  </div>
                  <div className="text-xl">{community?.slug}</div>
                </div>
                {community?.description && (
                  <div className="linkify">
                    <Linkify options={linkifyOptions}>
                      {community?.description}
                    </Linkify>
                  </div>
                )}
              </div>
            </div>
          </GridItemEight>
          <GridItemFour>
            <Card forceRounded>
              <CardBody className="space-y-3">
                <div className="flex items-center space-x-1.5">
                  <UsersIcon className="h-5 w-5" />
                  <div>
                    {humanize(community?.members?.totalCount)} members joined
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheckIcon className="h-5 w-5" />
                  <div>Moderated by</div>
                  <div className="flex items-center space-x-1">
                    <img
                      className="h-5 w-5 rounded-lg"
                      src={community?.owner?.profile?.avatar}
                      alt={`@${community?.owner?.username}'s username'`}
                    />
                    <Link href={`/u/${community?.owner?.username}`} passHref>
                      <a href={`/u/${community?.owner?.username}`}>
                        <Slug
                          slug={formatUsername(community?.owner?.username)}
                          prefix="@"
                        />
                      </a>
                    </Link>
                    {community?.members?.totalCount - 1 > 0 && (
                      <div className="text-gray-500">
                        and {humanize(community?.members?.totalCount)} others
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1.5">
                  <CalendarIcon className="h-5 w-5" />
                  <div>Created {timeago.format(community?.createdAt)}</div>
                </div>
              </CardBody>
            </Card>
          </GridItemFour>
        </GridLayout>
      </CardBody>
      <div className="border-t" />
      <div className="flex items-center justify-between py-4 px-5">
        <div className="flex items-center space-x-3">
          <Link href={`/communities/${community?.slug}`} passHref>
            <a href={`/communities/${community?.slug}`}>
              <Button
                variant="secondary"
                outline={router.pathname === '/communities/[slug]'}
                light={router.pathname !== '/communities/[slug]'}
              >
                Home
              </Button>
            </a>
          </Link>
          <Link href={`/communities/${community?.slug}/members`} passHref>
            <a href={`/communities/${community?.slug}/members`}>
              <Button
                variant="secondary"
                outline={router.pathname === '/communities/[slug]/members'}
                light={router.pathname !== '/communities/[slug]/members'}
              >
                Members
              </Button>
            </a>
          </Link>
          <Link href={`/communities/${community?.slug}/about`} passHref>
            <a href={`/communities/${community?.slug}/about`}>
              <Button
                variant="secondary"
                outline={router.pathname === '/communities/[slug]/about'}
                light={router.pathname !== '/communities/[slug]/about'}
              >
                About
              </Button>
            </a>
          </Link>
        </div>
        <div>
          {currentUser?.id !== community?.owner?.id ? (
            <Join community={community} showText />
          ) : (
            <Link
              href={`/communities/${community?.slug}/settings/profile`}
              passHref
            >
              <a href={`/communities/${community?.slug}/settings/profile`}>
                <Button
                  size="md"
                  variant="success"
                  icon={<PencilIcon className="h-4 w-4" />}
                >
                  Edit Community
                </Button>
              </a>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}

export default Details

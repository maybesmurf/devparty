import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import FeedType from '@components/Home/FeedType'
import NewPost from '@components/Post/NewPost'
import AppContext from '@components/utils/AppContext'
import dynamic from 'next/dynamic'
import React, { useContext, useState } from 'react'

import HomeFeed from './Feed'
import RecentProducts from './RecentProducts'
import WhoToFollow from './WhoToFollow'

const Footer = dynamic(() => import('@components/shared/Footer'))

const Home: React.FC = () => {
  const { currentUser } = useContext(AppContext)
  const [feedType, setFeedType] = useState<string>('ALL')

  return (
    <GridLayout>
      <GridItemEight>
        <div className="space-y-3">
          {currentUser && <NewPost />}
          <FeedType setFeedType={setFeedType} feedType={feedType} />
          <HomeFeed feedType={feedType} />
        </div>
      </GridItemEight>
      <GridItemFour>
        <WhoToFollow />
        <RecentProducts />
        <Footer />
      </GridItemFour>
    </GridLayout>
  )
}

export default Home

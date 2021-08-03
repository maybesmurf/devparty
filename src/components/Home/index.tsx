import { gql, useQuery } from '@apollo/client'
import React, { Fragment } from 'react'
import Posts from '~/pages/posts'
import NewPost from '~/pages/posts/new'
import { ErrorMessage } from '../ui/ErrorMessage'
import { GridItemEight, GridItemFour, GridLayout } from '../ui/GridLayout'
import Navbar from '../ui/Navbar'
import { RecentUsers } from './RecentUsers'
import { HomeQuery } from './__generated__/index.generated'

export const query = gql`
  query HomeQuery {
    me {
      id
      username
    }
  }
`

export const Home: React.FC = () => {
  const { data, loading, error } = useQuery<HomeQuery>(query)

  return (
    <Fragment>
      <Navbar currentUser={data?.me} />
      <GridLayout>
        <GridItemEight>
          <div className="space-y-6">
            {data?.me && <NewPost />}
            <Posts />
            <ErrorMessage
              title="Failed to load the current user."
              error={error}
            />
          </div>
        </GridItemEight>
        <GridItemFour>
          <RecentUsers />
        </GridItemFour>
      </GridLayout>
    </Fragment>
  )
}
